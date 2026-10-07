import { Company } from '../entities/company';
import { CompanyPublicHoliday } from '../entities/company-public-holiday';
import { PublicHoliday } from '../entities/public-holiday';
import { CalendarDate } from '../value-objects/calendar-date';
import { CompanyName } from '../value-objects/company-name';
import { DayOfWeek } from '../value-objects/day-of-week';
import { toCompanySettingsSnapshot } from './to-company-settings-snapshot';

function retained(id: string, date: string, label: string): CompanyPublicHoliday {
  return new CompanyPublicHoliday(
    'c1',
    new PublicHoliday(id, CalendarDate.parse(date), label),
  );
}

describe('toCompanySettingsSnapshot', () => {
  it('exposes the identity, the name and the default calendar of a company', () => {
    const company = Company.create('c1', CompanyName.parse('Acme'));

    expect(toCompanySettingsSnapshot(company)).toEqual({
      id: 'c1',
      name: 'Acme',
      nonWorkingWeekdays: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      publicHolidays: [],
    });
  });

  it('exposes the non-working weekdays chosen by the company', () => {
    const company = Company.create('c1', CompanyName.parse('Acme'));
    const calendar = company.calendar.withNonWorkingWeekdays([DayOfWeek.SUNDAY]);

    expect(
      toCompanySettingsSnapshot(company.withCalendar(calendar))
        .nonWorkingWeekdays,
    ).toEqual([DayOfWeek.SUNDAY]);
  });

  it('exposes every retained public holiday as a plain day and label', () => {
    const company = Company.create('c1', CompanyName.parse('Acme'));
    const calendar = company.calendar
      .addPublicHoliday(retained('ph-1', '2026-01-01', 'New Year'))
      .addPublicHoliday(retained('ph-2', '2026-07-14', 'Bastille Day'));

    expect(
      toCompanySettingsSnapshot(company.withCalendar(calendar)).publicHolidays,
    ).toEqual([
      { id: 'ph-1', date: '2026-01-01', label: 'New Year' },
      { id: 'ph-2', date: '2026-07-14', label: 'Bastille Day' },
    ]);
  });

  it('exposes the renamed company without touching its calendar', () => {
    const company = Company.create('c1', CompanyName.parse('Acme')).rename(
      CompanyName.parse('Nexus'),
    );

    expect(toCompanySettingsSnapshot(company)).toEqual({
      id: 'c1',
      name: 'Nexus',
      nonWorkingWeekdays: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      publicHolidays: [],
    });
  });
});
