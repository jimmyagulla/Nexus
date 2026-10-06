import {
  ActorContext,
  Company,
  CompanyName,
  DayOfWeek,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  MemoryClock,
  MemoryAuditLogRepository,
  MemoryCompanyRepository,
  MemoryIds,
} from './memory';
import { SetNonWorkingWeekdaysUseCase } from './set-non-working-weekdays.use-case';

describe('SetNonWorkingWeekdaysUseCase', () => {
  it('replaces habitual non-working weekdays and records the change', async () => {
    const companies = new MemoryCompanyRepository();
    const audits = new MemoryAuditLogRepository();
    await companies.save(Company.create('c1', CompanyName.parse('Acme')));
    const actor: ActorContext = {
      userId: 'user-1',
      companyId: 'c1',
      role: UserRole.EMPLOYER,
    };

    const settings = await new SetNonWorkingWeekdaysUseCase(
      companies,
      audits,
      new MemoryIds(),
      new MemoryClock(new Date('2026-10-06T10:00:00.000Z')),
    ).execute({
      actor,
      companyId: 'c1',
      weekdays: [DayOfWeek.SUNDAY],
    });

    expect(settings.nonWorkingWeekdays).toEqual([DayOfWeek.SUNDAY]);
    expect((await audits.listByCompany('c1'))[0]?.before?.daysOfWeek).toEqual([
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ]);
  });
});
