import { ErrorCode } from '../errors/error-code';

const CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export class CalendarDate {
  private constructor(readonly value: string) {}

  static parse(raw: string): CalendarDate {
    const match = CALENDAR_DATE.exec(raw);
    if (!match) {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
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
