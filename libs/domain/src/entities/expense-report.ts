import { ErrorCode } from '../errors/error-code';
import { ExpenseReportLabel } from '../value-objects/expense-report-label';
import { Expense } from './expense';
import { ExpenseReportStatus } from './expense-report-status';

export type ExpenseReportProps = {
  id: string;
  companyId: string;
  employeeId: string;
  label: ExpenseReportLabel;
  status: ExpenseReportStatus;
  expenses: readonly Expense[];
};

export class ExpenseReport {
  readonly id: string;
  readonly companyId: string;
  readonly employeeId: string;
  readonly label: ExpenseReportLabel;
  readonly status: ExpenseReportStatus;
  readonly expenses: readonly Expense[];

  constructor(private readonly props: ExpenseReportProps) {
    this.id = props.id;
    this.companyId = props.companyId;
    this.employeeId = props.employeeId;
    this.label = props.label;
    this.status = props.status;
    this.expenses = props.expenses;
  }

  static create(
    id: string,
    companyId: string,
    employeeId: string,
    label: ExpenseReportLabel,
  ): ExpenseReport {
    return new ExpenseReport({
      id,
      companyId,
      employeeId,
      label,
      status: ExpenseReportStatus.DRAFT,
      expenses: [],
    });
  }

  addExpense(expense: Expense): ExpenseReport {
    this.requireDraft();
    return this.with({ expenses: [...this.expenses, expense] });
  }

  requireDraft(): void {
    if (this.status !== ExpenseReportStatus.DRAFT) {
      throw new Error(ErrorCode.REQUEST_ALREADY_PROCESSED);
    }
  }

  private with(changes: Partial<ExpenseReportProps>): ExpenseReport {
    return new ExpenseReport({ ...this.props, ...changes });
  }
}
