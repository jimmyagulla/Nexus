import {
  ActorContext,
  CalendarDate,
  Company,
  CompanyName,
  CompanyPublicHoliday,
  ErrorCode,
  PublicHoliday,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  MemoryClock,
  MemoryAuditLogRepository,
  MemoryCompanyRepository,
  MemoryPublicHolidayRepository,
  MemoryIds,
} from './memory';
import { AddCompanyPublicHolidayUseCase } from './add-company-public-holiday.use-case';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

describe('AddCompanyPublicHolidayUseCase', () => {
  it('retains a public holiday on the company calendar', async () => {
    const companies = new MemoryCompanyRepository();
    await companies.save(Company.create('c1', CompanyName.parse('Acme')));
    const useCase = new AddCompanyPublicHolidayUseCase(
      companies,
      new MemoryPublicHolidayRepository(),
      new MemoryAuditLogRepository(),
      new MemoryIds(),
      new MemoryClock(new Date('2026-10-06T10:00:00.000Z')),
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

  it('reuses a public holiday already observed by another company', async () => {
    const companies = new MemoryCompanyRepository();
    const publicHolidays = new MemoryPublicHolidayRepository();
    const shared = new PublicHoliday(
      'ph-shared',
      CalendarDate.parse('2026-07-14'),
      'Bastille Day',
    );
    await publicHolidays.save(shared);
    await companies.save(
      Company.create('c2', CompanyName.parse('Other')).withCalendar(
        Company.create('c2', CompanyName.parse('Other')).calendar.addPublicHoliday(
          new CompanyPublicHoliday('c2', shared),
        ),
      ),
    );
    await companies.save(Company.create('c1', CompanyName.parse('Acme')));
    const useCase = new AddCompanyPublicHolidayUseCase(
      companies,
      publicHolidays,
      new MemoryAuditLogRepository(),
      new MemoryIds(),
      new MemoryClock(new Date('2026-10-06T10:00:00.000Z')),
    );

    const settings = await useCase.execute({
      actor,
      companyId: 'c1',
      date: '2026-07-14',
      label: 'Bastille Day',
    });

    expect(settings.publicHolidays[0]?.id).toBe('ph-shared');
  });

  it('rejects a second holiday on the same date', async () => {
    const companies = new MemoryCompanyRepository();
    await companies.save(Company.create('c1', CompanyName.parse('Acme')));
    const useCase = new AddCompanyPublicHolidayUseCase(
      companies,
      new MemoryPublicHolidayRepository(),
      new MemoryAuditLogRepository(),
      new MemoryIds(),
      new MemoryClock(new Date('2026-10-06T10:00:00.000Z')),
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
  });
});
