import {
  ExpenseDetailsInput,
  ExpenseReportListSnapshot,
  ExpenseReportSnapshot,
  ReceiptDetailsInput,
  ReceiptFileSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IAddExpenseFromSession,
  IAttachReceiptFromSession,
  ICreateExpenseReportFromSession,
  IGetExpenseReportFromSession,
  IGetReceiptFromSession,
  IListExpenseReportsFromSession,
  IRemoveExpenseFromSession,
  ISubmitExpenseReportFromSession,
  IUpdateExpenseFromSession,
} from '@hexagonal-monorepo-template/ports';

export class ExpenseReportsController {
  constructor(
    private readonly createFromSession: ICreateExpenseReportFromSession,
    private readonly addExpenseFromSession: IAddExpenseFromSession,
    private readonly getFromSession: IGetExpenseReportFromSession,
    private readonly listFromSession: IListExpenseReportsFromSession,
    private readonly updateExpenseFromSession: IUpdateExpenseFromSession,
    private readonly removeExpenseFromSession: IRemoveExpenseFromSession,
    private readonly attachReceiptFromSession: IAttachReceiptFromSession,
    private readonly submitFromSession: ISubmitExpenseReportFromSession,
    private readonly getReceiptFromSession: IGetReceiptFromSession,
  ) {}

  createReport(label: string): Promise<ExpenseReportSnapshot> {
    return this.createFromSession.execute(label);
  }

  addExpense(
    reportId: string,
    expense: ExpenseDetailsInput,
  ): Promise<ExpenseReportSnapshot> {
    return this.addExpenseFromSession.execute({ reportId, expense });
  }

  updateExpense(
    reportId: string,
    expenseId: string,
    expense: ExpenseDetailsInput,
  ): Promise<ExpenseReportSnapshot> {
    return this.updateExpenseFromSession.execute({
      reportId,
      expenseId,
      expense,
    });
  }

  removeExpense(
    reportId: string,
    expenseId: string,
  ): Promise<ExpenseReportSnapshot> {
    return this.removeExpenseFromSession.execute({ reportId, expenseId });
  }

  attachReceipt(
    reportId: string,
    receipt: ReceiptDetailsInput,
  ): Promise<ExpenseReportSnapshot> {
    return this.attachReceiptFromSession.execute({ reportId, receipt });
  }

  getReceipt(
    reportId: string,
    receiptId: string,
  ): Promise<ReceiptFileSnapshot> {
    return this.getReceiptFromSession.execute({ reportId, receiptId });
  }

  submitReport(reportId: string): Promise<ExpenseReportSnapshot> {
    return this.submitFromSession.execute(reportId);
  }

  getReport(reportId: string): Promise<ExpenseReportSnapshot> {
    return this.getFromSession.execute(reportId);
  }

  listReports(): Promise<ExpenseReportListSnapshot> {
    return this.listFromSession.execute();
  }
}
