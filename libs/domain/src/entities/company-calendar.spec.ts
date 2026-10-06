import { ErrorCode } from '../errors/error-code';
import { CalendarDate } from '../value-objects/calendar-date';
import { DayOfWeek } from '../value-objects/day-of-week';
import { CompanyCalendar } from './company-calendar';
import { CompanyPublicHoliday } from './company-public-holiday';
import { PublicHoliday } from './public-holiday';

describe('CompanyCalendar', () => {
  it('starts with Saturday and Sunday and no public holidays', () => {
    const calendar = CompanyCalendar.default();

    expect(calendar.nonWorkingWeekdays).toEqual([
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ]);
    expect(calendar.publicHolidays).toEqual([]);
  });

  it('replaces habitual non-working weekdays', () => {
    const calendar = CompanyCalendar.default().withNonWorkingWeekdays([
      DayOfWeek.SUNDAY,
    ]);

    expect(calendar.nonWorkingWeekdays).toEqual([DayOfWeek.SUNDAY]);
  });

  it('retains a public holiday for the company', () => {
    const holiday = new CompanyPublicHoliday(
      'company-1',
      new PublicHoliday('ph-1', CalendarDate.parse('2026-07-14'), 'Bastille Day'),
    );

    const calendar = CompanyCalendar.default().addPublicHoliday(holiday);

    expect(calendar.publicHolidays).toEqual([holiday]);
  });

  it('rejects a second public holiday on the same date', () => {
    const calendar = CompanyCalendar.default().addPublicHoliday(
      new CompanyPublicHoliday(
        'company-1',
        new PublicHoliday('ph-1', CalendarDate.parse('2026-07-14'), 'A'),
      ),
    );

    expect(() =>
      calendar.addPublicHoliday(
        new CompanyPublicHoliday(
          'company-1',
          new PublicHoliday('ph-2', CalendarDate.parse('2026-07-14'), 'B'),
        ),
      ),
    ).toThrow(ErrorCode.POTENTIAL_DUPLICATE);
  });

  it('drops a retained public holiday without touching others', () => {
    const kept = new CompanyPublicHoliday(
      'company-1',
      new PublicHoliday('ph-1', CalendarDate.parse('2026-01-01'), 'New Year'),
    );
    const removed = new CompanyPublicHoliday(
      'company-1',
      new PublicHoliday('ph-2', CalendarDate.parse('2026-07-14'), 'Bastille Day'),
    );

    const calendar = CompanyCalendar.default()
      .addPublicHoliday(kept)
      .addPublicHoliday(removed)
      .removePublicHoliday('ph-2');

    expect(calendar.publicHolidays).toEqual([kept]);
  });
});
