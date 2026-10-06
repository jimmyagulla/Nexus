import {
  FixedClock,
  InMemoryAuditLogRepository,
  InMemoryCompanyRepository,
  InMemoryPublicHolidayRepository,
  SequentialIdGenerator,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  AuditAction,
  AuditSubject,
  CalendarDate,
  Company,
  CompanyName,
  CompanyPublicHoliday,
  ErrorCode,
  PublicHoliday,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { AddCompanyPublicHolidayUseCase } from './add-company-public-holiday.use-case';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const now = new Date('2026-10-06T10:00:00.000Z');

function companyWith(
  id: string,
  publicHolidays: readonly PublicHoliday[],
): Company {
  return publicHolidays.reduce(
    (company, publicHoliday) =>
      company.withCalendar(
        company.calendar.addPublicHoliday(
          new CompanyPublicHoliday(company.id, publicHoliday),
        ),
      ),
    Company.create(id, CompanyName.parse('Acme')),
  );
}

describe('AddCompanyPublicHolidayUseCase', () => {
  it('retains a public holiday on the company calendar', async () => {
    const companies = new InMemoryCompanyRepository();
    await companies.save(companyWith('c1', []));
    const useCase = new AddCompanyPublicHolidayUseCase(
      companies,
      new InMemoryPublicHolidayRepository(),
      new InMemoryAuditLogRepository(),
      new SequentialIdGenerator(),
      new FixedClock(now),
    );

    const settings = await useCase.execute({
      actor,
      companyId: 'c1',
      date: '2026-07-14',
      label: 'Bastille Day',
    });

    expect(settings.publicHolidays).toEqual([
      { id: 'id-1', date: '2026-07-14', label: 'Bastille Day' },
    ]);
  });

  it('records the addition in the audit log', async () => {
    const companies = new InMemoryCompanyRepository();
    const audits = new InMemoryAuditLogRepository();
    await companies.save(companyWith('c1', []));
    const useCase = new AddCompanyPublicHolidayUseCase(
      companies,
      new InMemoryPublicHolidayRepository(),
      audits,
      new SequentialIdGenerator(),
      new FixedClock(now),
    );

    await useCase.execute({
      actor,
      companyId: 'c1',
      date: '2026-07-14',
      label: 'Bastille Day',
    });

    expect(await audits.listByCompany('c1')).toEqual([
      {
        id: 'id-2',
        companyId: 'c1',
        actorId: 'user-1',
        occurredAt: now,
        action: AuditAction.ADDITION,
        subject: AuditSubject.COMPANY_PUBLIC_HOLIDAY,
        before: null,
        after: {
          publicHolidayId: 'id-1',
          holidayDate: '2026-07-14',
          holidayLabel: 'Bastille Day',
        },
      },
    ]);
  });

  it('reuses a public holiday already observed by another company', async () => {
    const companies = new InMemoryCompanyRepository();
    const publicHolidays = new InMemoryPublicHolidayRepository();
    const shared = new PublicHoliday(
      'ph-shared',
      CalendarDate.parse('2026-07-14'),
      'Bastille Day',
    );
    await publicHolidays.save(shared);
    await companies.save(companyWith('c2', [shared]));
    await companies.save(companyWith('c1', []));
    const useCase = new AddCompanyPublicHolidayUseCase(
      companies,
      publicHolidays,
      new InMemoryAuditLogRepository(),
      new SequentialIdGenerator(),
      new FixedClock(now),
    );

    const settings = await useCase.execute({
      actor,
      companyId: 'c1',
      date: '2026-07-14',
      label: 'Bastille Day',
    });

    expect(settings.publicHolidays[0]?.id).toBe('ph-shared');
  });

  it('trims the label before retaining the public holiday', async () => {
    const companies = new InMemoryCompanyRepository();
    await companies.save(companyWith('c1', []));
    const useCase = new AddCompanyPublicHolidayUseCase(
      companies,
      new InMemoryPublicHolidayRepository(),
      new InMemoryAuditLogRepository(),
      new SequentialIdGenerator(),
      new FixedClock(now),
    );

    const settings = await useCase.execute({
      actor,
      companyId: 'c1',
      date: '2026-07-14',
      label: '  Bastille Day  ',
    });

    expect(settings.publicHolidays[0]?.label).toBe('Bastille Day');
  });

  it('rejects a blank label', async () => {
    const companies = new InMemoryCompanyRepository();
    await companies.save(companyWith('c1', []));
    const useCase = new AddCompanyPublicHolidayUseCase(
      companies,
      new InMemoryPublicHolidayRepository(),
      new InMemoryAuditLogRepository(),
      new SequentialIdGenerator(),
      new FixedClock(now),
    );

    await expect(
      useCase.execute({ actor, companyId: 'c1', date: '2026-07-14', label: ' ' }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
    expect((await companies.findById('c1'))?.calendar.publicHolidays).toEqual([]);
  });

  it('rejects a malformed date', async () => {
    const companies = new InMemoryCompanyRepository();
    await companies.save(companyWith('c1', []));
    const useCase = new AddCompanyPublicHolidayUseCase(
      companies,
      new InMemoryPublicHolidayRepository(),
      new InMemoryAuditLogRepository(),
      new SequentialIdGenerator(),
      new FixedClock(now),
    );

    await expect(
      useCase.execute({
        actor,
        companyId: 'c1',
        date: '14/07/2026',
        label: 'Bastille Day',
      }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
    expect((await companies.findById('c1'))?.calendar.publicHolidays).toEqual([]);
  });

  it('rejects a second holiday on the same date', async () => {
    const companies = new InMemoryCompanyRepository();
    await companies.save(companyWith('c1', []));
    const useCase = new AddCompanyPublicHolidayUseCase(
      companies,
      new InMemoryPublicHolidayRepository(),
      new InMemoryAuditLogRepository(),
      new SequentialIdGenerator(),
      new FixedClock(now),
    );
    await useCase.execute({
      actor,
      companyId: 'c1',
      date: '2026-07-14',
      label: 'A',
    });

    await expect(
      useCase.execute({
        actor,
        companyId: 'c1',
        date: '2026-07-14',
        label: 'B',
      }),
    ).rejects.toThrow(ErrorCode.POTENTIAL_DUPLICATE);
    expect(
      (await companies.findById('c1'))?.calendar.publicHolidays.map(
        (holiday) => holiday.publicHoliday.label,
      ),
    ).toEqual(['A']);
  });

  it('refuses another company', async () => {
    const companies = new InMemoryCompanyRepository();
    await companies.save(companyWith('c2', []));
    const useCase = new AddCompanyPublicHolidayUseCase(
      companies,
      new InMemoryPublicHolidayRepository(),
      new InMemoryAuditLogRepository(),
      new SequentialIdGenerator(),
      new FixedClock(now),
    );

    await expect(
      useCase.execute({
        actor,
        companyId: 'c2',
        date: '2026-07-14',
        label: 'Bastille Day',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect((await companies.findById('c2'))?.calendar.publicHolidays).toEqual([]);
  });
});