import { CompanyCalendar } from '../entities/company-calendar';
import { AbsenceFact } from '../facts/absence-fact';
import { CalendarDate } from '../value-objects/calendar-date';
import { PresenceMonth } from '../value-objects/presence-month';

export function proposeWorkedDays(
  month: PresenceMonth,
  calendar: CompanyCalendar,
  absences: readonly AbsenceFact[],
): number {
  return month
    .days()
    .filter(
      (day) =>
        !isNonWorkingInCalendar(day, calendar) && !isCoveredByAbsence(day, absences),
    ).length;
}

function isNonWorkingInCalendar(
  day: CalendarDate,
  calendar: CompanyCalendar,
): boolean {
  return (
    calendar.nonWorkingWeekdays.includes(day.dayOfWeek()) ||
    calendar.publicHolidays.some((holiday) =>
      holiday.publicHoliday.date.equals(day),
    )
  );
}

function isCoveredByAbsence(
  day: CalendarDate,
  absences: readonly AbsenceFact[],
): boolean {
  return absences.some((absence) => day.isWithin(absence.start, absence.end));
}
