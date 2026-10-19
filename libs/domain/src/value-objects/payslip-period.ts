import { ErrorCode } from '../errors/error-code';
import {
  PAYSLIP_MAX_YEAR,
  PAYSLIP_MIN_YEAR,
} from './payslip-limits';

/** Whether a number is a year a payslip may cover. */
export function isPayslipYear(year: number): boolean {
  return Number.isInteger(year) && year >= PAYSLIP_MIN_YEAR && year <= PAYSLIP_MAX_YEAR;
}

/** The month a payslip pays: a year and a month (1 = January). */
export class PayslipPeriod {
  private constructor(
    readonly year: number,
    readonly month: number,
  ) {}

  static of(year: number, month: number): PayslipPeriod {
    if (!isPayslipYear(year) || !Number.isInteger(month) || month < 1 || month > 12) {
      throw new Error(ErrorCode.INVALID_INFORMATION);
    }
    return new PayslipPeriod(year, month);
  }

  /** Chronological order: negative when this period comes first. */
  compare(other: PayslipPeriod): number {
    return this.year - other.year || this.month - other.month;
  }
}
