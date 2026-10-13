import { ErrorCode } from '../errors/error-code';
import { CALENDAR_DATE_PATTERN } from './calendar-date.pattern';
import { DayOfWeek } from './day-of-week';

const WEEKDAYS: readonly DayOfWeek[] = [
  DayOfWeek.SUNDAY,
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
];

export class CalendarDate {
  private constructor(readonly value: string) {}

  static parse(raw: string): CalendarDate {
    if (!CALENDAR_DATE_PATTERN.test(raw)) {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }

    const [year, month, day] = raw.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }

    return new CalendarDate(raw);
  }

  equals(other: CalendarDate): boolean {
    return this.value === other.value;
  }

  isWithin(start: CalendarDate, end: CalendarDate): boolean {
    return this.value >= start.value && this.value <= end.value;
  }

  dayOfWeek(): DayOfWeek {
    const [year, month, day] = this.value.split('-').map(Number);
    return WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  }
}
