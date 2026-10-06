import {
  FixedClock,
  InMemoryAuditLogRepository,
  InMemoryCompanyRepository,
  SequentialIdGenerator,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  Company,
  CompanyName,
  DayOfWeek,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { SetNonWorkingWeekdaysUseCase } from './set-non-working-weekdays.use-case';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

describe('SetNonWorkingWeekdaysUseCase', () => {
  it('replaces habitual non-working weekdays and records the change', async () => {
    const companies = new InMemoryCompanyRepository();
    const audits = new InMemoryAuditLogRepository();
    await companies.save(Company.create('c1', CompanyName.parse('Acme')));

    const settings = await new SetNonWorkingWeekdaysUseCase(
      companies,
      audits,
      new SequentialIdGenerator(),
      new FixedClock(new Date('2026-10-06T10:00:00.000Z')),
    ).execute({
      actor,
      companyId: 'c1',
      weekdays: [DayOfWeek.SUNDAY],
    });

    expect(settings.nonWorkingWeekdays).toEqual([DayOfWeek.SUNDAY]);
    expect((await companies.findById('c1'))?.calendar.nonWorkingWeekdays).toEqual(
      [DayOfWeek.SUNDAY],
    );
    expect((await audits.listByCompany('c1'))[0]?.before?.daysOfWeek).toEqual([
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ]);
  });

  it('keeps a single entry per weekday', async () => {
    const companies = new InMemoryCompanyRepository();
    await companies.save(Company.create('c1', CompanyName.parse('Acme')));

    const settings = await new SetNonWorkingWeekdaysUseCase(
      companies,
      new InMemoryAuditLogRepository(),
      new SequentialIdGenerator(),
      new FixedClock(new Date('2026-10-06T10:00:00.000Z')),
    ).execute({
      actor,
      companyId: 'c1',
      weekdays: [DayOfWeek.SUNDAY, DayOfWeek.SUNDAY],
    });

    expect(settings.nonWorkingWeekdays).toEqual([DayOfWeek.SUNDAY]);
  });

  it('refuses another company and leaves its calendar untouched', async () => {
    const companies = new InMemoryCompanyRepository();
    const audits = new InMemoryAuditLogRepository();
    await companies.save(Company.create('c2', CompanyName.parse('Other')));
    const useCase = new SetNonWorkingWeekdaysUseCase(
      companies,
      audits,
      new SequentialIdGenerator(),
      new FixedClock(new Date('2026-10-06T10:00:00.000Z')),
    );

    await expect(
      useCase.execute({ actor, companyId: 'c2', weekdays: [DayOfWeek.MONDAY] }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect((await companies.findById('c2'))?.calendar.nonWorkingWeekdays).toEqual(
      [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
    );
    expect(await audits.listByCompany('c2')).toEqual([]);
  });
});