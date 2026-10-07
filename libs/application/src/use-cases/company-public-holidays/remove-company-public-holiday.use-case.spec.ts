import {
  FixedClock,
  InMemoryAuditLogRepository,
  InMemoryCompanyRepository,
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
import { RemoveCompanyPublicHolidayUseCase } from './remove-company-public-holiday.use-case';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const now = new Date('2026-10-06T10:00:00.000Z');

const retained = new PublicHoliday(
  'ph-1',
  CalendarDate.parse('2026-07-14'),
  'Bastille Day',
);

function companyWithRetainedHoliday(): Company {
  const company = Company.create('c1', CompanyName.parse('Acme'));
  return company.withCalendar(
    company.calendar.addPublicHoliday(
      new CompanyPublicHoliday(company.id, retained),
    ),
  );
}

describe('RemoveCompanyPublicHolidayUseCase', () => {
  it('drops the retained public holiday from the calendar', async () => {
    const companies = new InMemoryCompanyRepository();
    await companies.save(companyWithRetainedHoliday());

    const settings = await new RemoveCompanyPublicHolidayUseCase(
      companies,
      new InMemoryAuditLogRepository(),
      new SequentialIdGenerator(),
      new FixedClock(now),
    ).execute({ actor, companyId: 'c1', publicHolidayId: 'ph-1' });

    expect(settings.publicHolidays).toEqual([]);
    expect((await companies.findById('c1'))?.calendar.publicHolidays).toEqual([]);
  });

  it('records the removed public holiday', async () => {
    const companies = new InMemoryCompanyRepository();
    const audits = new InMemoryAuditLogRepository();
    await companies.save(companyWithRetainedHoliday());

    await new RemoveCompanyPublicHolidayUseCase(
      companies,
      audits,
      new SequentialIdGenerator(),
      new FixedClock(now),
    ).execute({ actor, companyId: 'c1', publicHolidayId: 'ph-1' });

    expect(await audits.listByCompany('c1')).toEqual([
      {
        id: 'id-1',
        companyId: 'c1',
        actorId: 'user-1',
        occurredAt: now,
        action: AuditAction.DELETION,
        subject: AuditSubject.COMPANY_PUBLIC_HOLIDAY,
        before: {
          publicHolidayId: 'ph-1',
          holidayDate: '2026-07-14',
          holidayLabel: 'Bastille Day',
        },
        after: null,
      },
    ]);
  });

  it('refuses a public holiday the company never retained', async () => {
    const companies = new InMemoryCompanyRepository();
    await companies.save(companyWithRetainedHoliday());
    const useCase = new RemoveCompanyPublicHolidayUseCase(
      companies,
      new InMemoryAuditLogRepository(),
      new SequentialIdGenerator(),
      new FixedClock(now),
    );

    await expect(
      useCase.execute({
        actor,
        companyId: 'c1',
        publicHolidayId: 'ph-unknown',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(
      (await companies.findById('c1'))?.calendar.publicHolidays.map(
        (holiday) => holiday.publicHoliday.id,
      ),
    ).toEqual(['ph-1']);
  });

  it('refuses another company', async () => {
    const companies = new InMemoryCompanyRepository();
    await companies.save(Company.create('c2', CompanyName.parse('Other')));
    const useCase = new RemoveCompanyPublicHolidayUseCase(
      companies,
      new InMemoryAuditLogRepository(),
      new SequentialIdGenerator(),
      new FixedClock(now),
    );

    await expect(
      useCase.execute({ actor, companyId: 'c2', publicHolidayId: 'ph-1' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});