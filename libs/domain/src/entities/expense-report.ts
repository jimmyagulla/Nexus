import { ErrorCode } from '../errors/error-code';
import { ExpenseReportLabel } from '../value-objects/expense-report-label';
import { Money } from '../value-objects/money';
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

  total(): Money {
    return this.expenses.reduce(
      (sum, expense) => sum.plus(expense.details.amount),
      Money.zero(),
    );
  }

  addExpense(expense: Expense): ExpenseReport {
    this.requireDraft();
    return this.with({ expenses: [...this.expenses, expense] });
  }

  updateExpense(expense: Expense): ExpenseReport {
    this.requireDraft();
    this.requireExpense(expense.id);
    return this.with({
      expenses: this.expenses.map((current) =>
        current.id === expense.id ? expense : current,
      ),
    });
  }

  removeExpense(expenseId: string): ExpenseReport {
    this.requireDraft();
    this.requireExpense(expenseId);
    return this.with({
      expenses: this.expenses.filter((current) => current.id !== expenseId),
    });
  }

  requireDraft(): void {
    if (this.status !== ExpenseReportStatus.DRAFT) {
      throw new Error(ErrorCode.REQUEST_ALREADY_PROCESSED);
    }
  }

  private requireExpense(expenseId: string): void {
    if (!this.expenses.some((current) => current.id === expenseId)) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
  }

  private with(changes: Partial<ExpenseReportProps>): ExpenseReport {
    return new ExpenseReport({ ...this.props, ...changes });
  }
}
