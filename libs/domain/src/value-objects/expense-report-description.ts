import { ErrorCode } from '../errors/error-code';
import { EXPENSE_REPORT_DESCRIPTION_MAX_LENGTH } from './expense-report-limits';

/** What the expense was for; also the name the list shows. */
export class ExpenseReportDescription {
  private constructor(readonly value: string) {}

  static parse(raw: string): ExpenseReportDescription {
    const value = raw.trim();
    if (value === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    if (value.length > EXPENSE_REPORT_DESCRIPTION_MAX_LENGTH) {
      throw new Error(ErrorCode.INVALID_INFORMATION);
    }
    return new ExpenseReportDescription(value);
  }
}
