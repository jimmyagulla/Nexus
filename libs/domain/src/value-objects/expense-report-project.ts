import { ErrorCode } from '../errors/error-code';
import { EXPENSE_REPORT_PROJECT_MAX_LENGTH } from './expense-report-limits';

/** Project, client or service the expense is charged to. */
export class ExpenseReportProject {
  private constructor(readonly value: string) {}

  /** A blank project is no project. */
  static parse(raw: string | null | undefined): ExpenseReportProject | null {
    const value = (raw ?? '').trim();
    if (value === '') {
      return null;
    }
    if (value.length > EXPENSE_REPORT_PROJECT_MAX_LENGTH) {
      throw new Error(ErrorCode.INVALID_INFORMATION);
    }
    return new ExpenseReportProject(value);
  }
}
