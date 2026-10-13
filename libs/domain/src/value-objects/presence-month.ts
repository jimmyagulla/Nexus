import { ErrorCode } from '../errors/error-code';
import { CalendarDate } from './calendar-date';
import { PRESENCE_MONTH_PATTERN } from './presence-month.pattern';

export class PresenceMonth {
  private constructor(
    readonly value: string,
    readonly year: number,
    readonly month: number,
  ) {}

  static parse(raw: string): PresenceMonth {
    if (!PRESENCE_MONTH_PATTERN.test(raw)) {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }

    const [year, month] = raw.split('-').map(Number);

    return new PresenceMonth(raw, year, month);
  }

  contains(day: CalendarDate): boolean {
    return day.isWithin(this.firstDay(), this.lastDay());
  }

  overlaps(start: CalendarDate, end: CalendarDate): boolean {
    return (
      this.firstDay().isWithin(start, end) ||
      this.lastDay().isWithin(start, end) ||
      start.isWithin(this.firstDay(), this.lastDay())
    );
  }

  days(): CalendarDate[] {
    const count = new Date(Date.UTC(this.year, this.month, 0)).getUTCDate();

    return Array.from({ length: count }, (_, index) => this.day(index + 1));
  }

  private firstDay(): CalendarDate {
    return this.day(1);
  }

  private lastDay(): CalendarDate {
    return this.day(new Date(Date.UTC(this.year, this.month, 0)).getUTCDate());
  }

  private day(dayOfMonth: number): CalendarDate {
    return CalendarDate.parse(
      `${this.value}-${String(dayOfMonth).padStart(2, '0')}`,
    );
  }
}
