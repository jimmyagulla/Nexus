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
import { UpdateCompanyPublicHolidayUseCase } from './update-company-public-holiday.use-case';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const now = new Date('2026-10-06T10:00:00.000Z');

const retained = new PublicHoliday(
  'ph-1',
  CalendarDate.parse('2026-07-14'),
  'Old',
);

function companyWithRetainedHoliday(): Company {
  const company = Company.create('c1', CompanyName.parse('Acme'));
  return company.withCalendar(
    company.calendar.addPublicHoliday(
      new CompanyPublicHoliday(company.id, retained),
    ),
  );
}

describe('UpdateCompanyPublicHolidayUseCase', () => {
  it('replaces the retained public holiday', async () => {
    const companies = new InMemoryCompanyRepository();
    const publicHolidays = new InMemoryPublicHolidayRepository();
    await publicHolidays.save(retained);
    await companies.save(companyWithRetainedHoliday());

    const settings = await new UpdateCompanyPublicHolidayUseCase(
      companies,
      publicHolidays,
      new InMemoryAuditLogRepository(),
      new SequentialIdGenerator(),
      new FixedClock(now),
    ).execute({
      actor,
      companyId: 'c1',
      publicHolidayId: 'ph-1',
      date: '2026-11-11',
      label: 'Armistice',
    });

    expect(settings.publicHolidays).toEqual([
      { id: 'id-1', date: '2026-11-11', label: 'Armistice' },
    ]);
  });

  it('records the previous and the next public holiday', async () => {
    const companies = new InMemoryCompanyRepository();
    const publicHolidays = new InMemoryPublicHolidayRepository();
    const audits = new InMemoryAuditLogRepository();
    await publicHolidays.save(retained);
    await companies.save(companyWithRetainedHoliday());

    await new UpdateCompanyPublicHolidayUseCase(
      companies,
      publicHolidays,
      audits,
      new SequentialIdGenerator(),
      new FixedClock(now),
    ).execute({
      actor,
      companyId: 'c1',
      publicHolidayId: 'ph-1',
      date: '2026-11-11',
      label: 'Armistice',
    });

    expect(await audits.listByCompany('c1')).toEqual([
      {
        id: 'id-2',
        companyId: 'c1',
        actorId: 'user-1',
        occurredAt: now,
        action: AuditAction.MODIFICATION,
        subject: AuditSubject.COMPANY_PUBLIC_HOLIDAY,
        before: {
          publicHolidayId: 'ph-1',
          holidayDate: '2026-07-14',
          holidayLabel: 'Old',
        },
        after: {
          publicHolidayId: 'id-1',
          holidayDate: '2026-11-11',
          holidayLabel: 'Armistice',
        },
      },
    ]);
  });

  it('reuses a public holiday already observed elsewhere', async () => {
    const companies = new InMemoryCompanyRepository();
    const publicHolidays = new InMemoryPublicHolidayRepository();
    const shared = new PublicHoliday(
      'ph-shared',
      CalendarDate.parse('2026-11-11'),
      'Armistice',
    );
    await publicHolidays.save(retained);
    await publicHolidays.save(shared);
    await companies.save(companyWithRetainedHoliday());

    const settings = await new UpdateCompanyPublicHolidayUseCase(
      companies,
      publicHolidays,
      new InMemoryAuditLogRepository(),
      new SequentialIdGenerator(),
      new FixedClock(now),
    ).execute({
      actor,
      companyId: 'c1',
      publicHolidayId: 'ph-1',
      date: '2026-11-11',
      label: 'Armistice',
    });

    expect(settings.publicHolidays).toEqual([
      { id: 'ph-shared', date: '2026-11-11', label: 'Armistice' },
    ]);
  });

  it('refuses a public holiday the company never retained', async () => {
    const companies = new InMemoryCompanyRepository();
    await companies.save(companyWithRetainedHoliday());
    const useCase = new UpdateCompanyPublicHolidayUseCase(
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
        publicHolidayId: 'ph-unknown',
        date: '2026-11-11',
        label: 'Armistice',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(
      (await companies.findById('c1'))?.calendar.publicHolidays.map(
        (holiday) => holiday.publicHoliday.label,
      ),
    ).toEqual(['Old']);
  });

  it('rejects a blank label', async () => {
    const companies = new InMemoryCompanyRepository();
    await companies.save(companyWithRetainedHoliday());
    const useCase = new UpdateCompanyPublicHolidayUseCase(
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
        publicHolidayId: 'ph-1',
        date: '2026-11-11',
        label: '  ',
      }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('rejects a malformed date', async () => {
    const companies = new InMemoryCompanyRepository();
    await companies.save(companyWithRetainedHoliday());
    const useCase = new UpdateCompanyPublicHolidayUseCase(
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
        publicHolidayId: 'ph-1',
        date: '2026-02-30',
        label: 'Armistice',
      }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('refuses another company', async () => {
    const companies = new InMemoryCompanyRepository();
    await companies.save(Company.create('c2', CompanyName.parse('Other')));
    const useCase = new UpdateCompanyPublicHolidayUseCase(
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
        publicHolidayId: 'ph-1',
        date: '2026-11-11',
        label: 'Armistice',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});