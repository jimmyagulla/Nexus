import { ErrorCode } from '../errors/error-code';

export class ExpenseReportLabel {
  private constructor(readonly value: string) {}

  static parse(raw: string): ExpenseReportLabel {
    const value = raw.trim();
    if (value === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    return new ExpenseReportLabel(value);
  }
}
