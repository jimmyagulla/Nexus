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

  it('retains a weekday listed twice only once', () => {
    const calendar = CompanyCalendar.default().withNonWorkingWeekdays([
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
      DayOfWeek.SUNDAY,
    ]);

    expect(calendar.nonWorkingWeekdays).toEqual([
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
    ]);
  });

  it('accepts a week without any non-working weekday', () => {
    expect(
      CompanyCalendar.default().withNonWorkingWeekdays([]).nonWorkingWeekdays,
    ).toEqual([]);
  });

  it('keeps the retained public holidays when the weekdays change', () => {
    const holiday = new CompanyPublicHoliday(
      'company-1',
      new PublicHoliday('ph-1', CalendarDate.parse('2026-07-14'), 'Bastille Day'),
    );

    const calendar = CompanyCalendar.default()
      .addPublicHoliday(holiday)
      .withNonWorkingWeekdays([DayOfWeek.SUNDAY]);

    expect(calendar.publicHolidays).toEqual([holiday]);
  });

  it('leaves the previous weekdays untouched when the weekdays change', () => {
    const calendar = CompanyCalendar.default();

    calendar.withNonWorkingWeekdays([DayOfWeek.MONDAY]);

    expect(calendar.nonWorkingWeekdays).toEqual([
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ]);
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

  it('hands back a retained public holiday by id', () => {
    const retained = new CompanyPublicHoliday(
      'company-1',
      new PublicHoliday('ph-1', CalendarDate.parse('2026-07-14'), 'Bastille Day'),
    );

    const calendar = CompanyCalendar.default().addPublicHoliday(retained);

    expect(calendar.requirePublicHoliday('ph-1')).toBe(retained);
  });

  it('refuses a public holiday the company never retained', () => {
    expect(() =>
      CompanyCalendar.default().requirePublicHoliday('ph-unknown'),
    ).toThrow(ErrorCode.ACCESS_DENIED);
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

  it('leaves the previous calendar untouched when a public holiday is retained', () => {
    const calendar = CompanyCalendar.default();

    calendar.addPublicHoliday(
      new CompanyPublicHoliday(
        'company-1',
        new PublicHoliday('ph-1', CalendarDate.parse('2026-07-14'), 'Bastille Day'),
      ),
    );

    expect(calendar.publicHolidays).toEqual([]);
  });

  it('ignores the removal of a public holiday it never retained', () => {
    const kept = new CompanyPublicHoliday(
      'company-1',
      new PublicHoliday('ph-1', CalendarDate.parse('2026-01-01'), 'New Year'),
    );

    const calendar = CompanyCalendar.default()
      .addPublicHoliday(kept)
      .removePublicHoliday('ph-unknown');

    expect(calendar.publicHolidays).toEqual([kept]);
  });

  it('frees the day of a public holiday it replaces', () => {
    const renamed = new CompanyPublicHoliday(
      'company-1',
      new PublicHoliday(
        'ph-1',
        CalendarDate.parse('2026-07-14'),
        'Fete nationale',
      ),
    );

    const calendar = CompanyCalendar.default()
      .addPublicHoliday(
        new CompanyPublicHoliday(
          'company-1',
          new PublicHoliday(
            'ph-1',
            CalendarDate.parse('2026-07-14'),
            'Bastille Day',
          ),
        ),
      )
      .replacePublicHoliday('ph-1', renamed);

    expect(calendar.publicHolidays).toEqual([renamed]);
  });

  it('moves a replaced public holiday to another day', () => {
    const moved = new CompanyPublicHoliday(
      'company-1',
      new PublicHoliday('ph-1', CalendarDate.parse('2026-05-01'), 'Labour Day'),
    );

    const calendar = CompanyCalendar.default()
      .addPublicHoliday(
        new CompanyPublicHoliday(
          'company-1',
          new PublicHoliday(
            'ph-1',
            CalendarDate.parse('2026-07-14'),
            'Bastille Day',
          ),
        ),
      )
      .replacePublicHoliday('ph-1', moved);

    expect(calendar.publicHolidays).toEqual([moved]);
  });

  it('refuses a replacement landing on a day already retained', () => {
    const calendar = CompanyCalendar.default()
      .addPublicHoliday(
        new CompanyPublicHoliday(
          'company-1',
          new PublicHoliday('ph-1', CalendarDate.parse('2026-01-01'), 'New Year'),
        ),
      )
      .addPublicHoliday(
        new CompanyPublicHoliday(
          'company-1',
          new PublicHoliday(
            'ph-2',
            CalendarDate.parse('2026-07-14'),
            'Bastille Day',
          ),
        ),
      );

    expect(() =>
      calendar.replacePublicHoliday(
        'ph-1',
        new CompanyPublicHoliday(
          'company-1',
          new PublicHoliday('ph-1', CalendarDate.parse('2026-07-14'), 'New Year'),
        ),
      ),
    ).toThrow(ErrorCode.POTENTIAL_DUPLICATE);
  });

  it('keeps the non-working weekdays when a public holiday is replaced', () => {
    const calendar = CompanyCalendar.default()
      .withNonWorkingWeekdays([DayOfWeek.SUNDAY])
      .addPublicHoliday(
        new CompanyPublicHoliday(
          'company-1',
          new PublicHoliday(
            'ph-1',
            CalendarDate.parse('2026-07-14'),
            'Bastille Day',
          ),
        ),
      )
      .replacePublicHoliday(
        'ph-1',
        new CompanyPublicHoliday(
          'company-1',
          new PublicHoliday(
            'ph-1',
            CalendarDate.parse('2026-05-01'),
            'Labour Day',
          ),
        ),
      );

    expect(calendar.nonWorkingWeekdays).toEqual([DayOfWeek.SUNDAY]);
  });
});
