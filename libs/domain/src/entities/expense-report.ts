import { ErrorCode } from '../errors/error-code';
import { ExpenseReportLabel } from '../value-objects/expense-report-label';
import { Money } from '../value-objects/money';
import { Expense } from './expense';
import { ExpenseReportStatus } from './expense-report-status';
import { Receipt } from './receipt';

export type ExpenseReportProps = {
  id: string;
  companyId: string;
  employeeId: string;
  label: ExpenseReportLabel;
  status: ExpenseReportStatus;
  expenses: readonly Expense[];
  receipts?: readonly Receipt[];
};

export class ExpenseReport {
  readonly id: string;
  readonly companyId: string;
  readonly employeeId: string;
  readonly label: ExpenseReportLabel;
  readonly status: ExpenseReportStatus;
  readonly expenses: readonly Expense[];
  readonly receipts: readonly Receipt[];

  constructor(private readonly props: ExpenseReportProps) {
    this.id = props.id;
    this.companyId = props.companyId;
    this.employeeId = props.employeeId;
    this.label = props.label;
    this.status = props.status;
    this.expenses = props.expenses;
    this.receipts = props.receipts ?? [];
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
      receipts: [],
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
      receipts: this.receipts.map((receipt) =>
        receipt.details.expenseId === expenseId
          ? new Receipt(receipt.id, receipt.details.detachedFromExpense())
          : receipt,
      ),
    });
  }

  attachReceipt(receipt: Receipt): ExpenseReport {
    this.requireDraft();
    if (receipt.details.expenseId !== null) {
      this.requireExpense(receipt.details.expenseId);
    }
    return this.with({ receipts: [...this.receipts, receipt] });
  }

  submit(): ExpenseReport {
    this.requireDraft();
    if (this.expenses.length === 0) {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    if (this.receipts.length === 0) {
      throw new Error(ErrorCode.MISSING_DOCUMENT);
    }
    return this.with({ status: ExpenseReportStatus.SUBMITTED });
  }

  requireReceipt(receiptId: string): Receipt {
    const receipt = this.receipts.find((current) => current.id === receiptId);
    if (receipt === undefined) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return receipt;
  }

  requireDraft(): void {
    if (this.status !== ExpenseReportStatus.DRAFT) {
      throw new Error(ErrorCode.REQUEST_ALREADY_PROCESSED);
    }
  }

  requireExpense(expenseId: string): void {
    if (!this.expenses.some((current) => current.id === expenseId)) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
  }

  private with(changes: Partial<ExpenseReportProps>): ExpenseReport {
    return new ExpenseReport({ ...this.props, ...changes });
  }
}
