import { CompanyCalendar } from '../entities/company-calendar';
import { CompanyPublicHoliday } from '../entities/company-public-holiday';
import { PublicHoliday } from '../entities/public-holiday';
import { AbsenceFact } from '../facts/absence-fact';
import { CalendarDate } from '../value-objects/calendar-date';
import { DayOfWeek } from '../value-objects/day-of-week';
import { PresenceMonth } from '../value-objects/presence-month';
import { proposeWorkedDays } from './propose-worked-days';

const october = PresenceMonth.parse('2026-10');

function holiday(date: string): CompanyPublicHoliday {
  return new CompanyPublicHoliday(
    'c1',
    new PublicHoliday(`ph-${date}`, CalendarDate.parse(date), 'Férié'),
  );
}

function absence(start: string, end: string): AbsenceFact {
  return {
    id: `a-${start}`,
    companyId: 'c1',
    employeeId: 'e1',
    start: CalendarDate.parse(start),
    end: CalendarDate.parse(end),
    type: 'Congés payés',
    days: 1,
    sourceRequestId: 'r1',
  };
}

describe('proposeWorkedDays', () => {
  it('counts the days of the month the default calendar leaves working', () => {
    expect(proposeWorkedDays(october, CompanyCalendar.default(), [])).toBe(22);
  });

  it('follows the non-working weekdays the company chose', () => {
    const sundaysOnly = CompanyCalendar.default().withNonWorkingWeekdays([
      DayOfWeek.SUNDAY,
    ]);

    expect(proposeWorkedDays(october, sundaysOnly, [])).toBe(27);
  });

  it('counts every day when the company rests on no weekday', () => {
    const noRest = CompanyCalendar.default().withNonWorkingWeekdays([]);

    expect(proposeWorkedDays(october, noRest, [])).toBe(31);
  });

  it('counts only the Sundays when the company rests every other weekday', () => {
    expect(
      proposeWorkedDays(
        PresenceMonth.parse('2026-02'),
        CompanyCalendar.default().withNonWorkingWeekdays([
          DayOfWeek.MONDAY,
          DayOfWeek.TUESDAY,
          DayOfWeek.WEDNESDAY,
          DayOfWeek.THURSDAY,
          DayOfWeek.FRIDAY,
          DayOfWeek.SATURDAY,
        ]),
        [],
      ),
    ).toBe(4);
  });

  it('does not count a public holiday that falls on a working day', () => {
    const calendar = CompanyCalendar.default().addPublicHoliday(
      holiday('2026-10-12'),
    );

    expect(proposeWorkedDays(october, calendar, [])).toBe(21);
  });

  it('does not count a public holiday twice when it falls on a weekend', () => {
    const calendar = CompanyCalendar.default().addPublicHoliday(
      holiday('2026-10-10'),
    );

    expect(proposeWorkedDays(october, calendar, [])).toBe(22);
  });

  it('ignores a public holiday of another month', () => {
    const calendar = CompanyCalendar.default().addPublicHoliday(
      holiday('2026-11-11'),
    );

    expect(proposeWorkedDays(october, calendar, [])).toBe(22);
  });

  it('does not count the days covered by an absence', () => {
    expect(
      proposeWorkedDays(october, CompanyCalendar.default(), [
        absence('2026-10-05', '2026-10-07'),
      ]),
    ).toBe(19);
  });

  it('does not count a day twice when an absence covers a weekend', () => {
    expect(
      proposeWorkedDays(october, CompanyCalendar.default(), [
        absence('2026-10-02', '2026-10-05'),
      ]),
    ).toBe(20);
  });

  it('does not count a day twice when an absence covers a public holiday', () => {
    const calendar = CompanyCalendar.default().addPublicHoliday(
      holiday('2026-10-12'),
    );

    expect(
      proposeWorkedDays(october, calendar, [absence('2026-10-12', '2026-10-13')]),
    ).toBe(20);
  });

  it('counts only the days of the month for an absence that began before it', () => {
    expect(
      proposeWorkedDays(october, CompanyCalendar.default(), [
        absence('2026-09-28', '2026-10-02'),
      ]),
    ).toBe(20);
  });

  it('counts only the days of the month for an absence that ends after it', () => {
    expect(
      proposeWorkedDays(october, CompanyCalendar.default(), [
        absence('2026-10-29', '2026-11-03'),
      ]),
    ).toBe(20);
  });

  it('counts a day once when two absences overlap', () => {
    expect(
      proposeWorkedDays(october, CompanyCalendar.default(), [
        absence('2026-10-05', '2026-10-07'),
        absence('2026-10-06', '2026-10-08'),
      ]),
    ).toBe(18);
  });

  it('ignores an absence of another month', () => {
    expect(
      proposeWorkedDays(october, CompanyCalendar.default(), [
        absence('2026-11-02', '2026-11-04'),
      ]),
    ).toBe(22);
  });

  it('counts the days of a short month', () => {
    expect(
      proposeWorkedDays(
        PresenceMonth.parse('2026-02'),
        CompanyCalendar.default(),
        [],
      ),
    ).toBe(20);
  });

  it('counts a leap February one day longer', () => {
    expect(
      proposeWorkedDays(
        PresenceMonth.parse('2028-02'),
        CompanyCalendar.default(),
        [],
      ),
    ).toBe(21);
  });
});
