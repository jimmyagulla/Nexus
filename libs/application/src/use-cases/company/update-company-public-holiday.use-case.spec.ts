import {
  ActorContext,
  CalendarDate,
  Company,
  CompanyName,
  CompanyPublicHoliday,
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
import { UpdateCompanyPublicHolidayUseCase } from './update-company-public-holiday.use-case';

describe('UpdateCompanyPublicHolidayUseCase', () => {
  it('replaces the retained public holiday', async () => {
    const companies = new MemoryCompanyRepository();
    const publicHolidays = new MemoryPublicHolidayRepository();
    const current = new PublicHoliday(
      'ph-1',
      CalendarDate.parse('2026-07-14'),
      'Old',
    );
    await publicHolidays.save(current);
    await companies.save(
      Company.create('c1', CompanyName.parse('Acme')).withCalendar(
        Company.create('c1', CompanyName.parse('Acme')).calendar.addPublicHoliday(
          new CompanyPublicHoliday('c1', current),
        ),
      ),
    );

    const settings = await new UpdateCompanyPublicHolidayUseCase(
      companies,
      publicHolidays,
      new MemoryAuditLogRepository(),
      new MemoryIds(),
      new MemoryClock(new Date('2026-10-06T10:00:00.000Z')),
    ).execute({
      actor: {
        userId: 'user-1',
        companyId: 'c1',
        role: UserRole.EMPLOYER,
      },
      companyId: 'c1',
      publicHolidayId: 'ph-1',
      date: '2026-11-11',
      label: 'Armistice',
    });

    expect(settings.publicHolidays).toEqual([
      { id: 'id-1', date: '2026-11-11', label: 'Armistice' },
    ]);
  });
});
