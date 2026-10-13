import { ErrorCode } from '../errors/error-code';
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
}
