import { ErrorCode } from '../errors/error-code';
import { CALENDAR_DATE_PATTERN } from './calendar-date.pattern';

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
}
