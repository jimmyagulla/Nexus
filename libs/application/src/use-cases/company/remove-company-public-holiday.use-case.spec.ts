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
  MemoryIds,
} from './memory';
import { RemoveCompanyPublicHolidayUseCase } from './remove-company-public-holiday.use-case';

describe('RemoveCompanyPublicHolidayUseCase', () => {
  it('drops the retained public holiday from the calendar', async () => {
    const companies = new MemoryCompanyRepository();
    const holiday = new PublicHoliday(
      'ph-1',
      CalendarDate.parse('2026-07-14'),
      'Bastille Day',
    );
    await companies.save(
      Company.create('c1', CompanyName.parse('Acme')).withCalendar(
        Company.create('c1', CompanyName.parse('Acme')).calendar.addPublicHoliday(
          new CompanyPublicHoliday('c1', holiday),
        ),
      ),
    );

    const settings = await new RemoveCompanyPublicHolidayUseCase(
      companies,
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
    });

    expect(settings.publicHolidays).toEqual([]);
  });
});
