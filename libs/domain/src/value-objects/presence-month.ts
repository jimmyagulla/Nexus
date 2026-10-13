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

  days(): CalendarDate[] {
    const count = new Date(Date.UTC(this.year, this.month, 0)).getUTCDate();

    return Array.from({ length: count }, (_, index) =>
      CalendarDate.parse(`${this.value}-${String(index + 1).padStart(2, '0')}`),
    );
  }
}
