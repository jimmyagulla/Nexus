import {
  ExpenseDetailsInput,
  ExpenseReportFilterInput,
  ExpenseReportIndicators,
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
  IGetExpenseReportIndicatorsFromSession,
  IGetReceiptFromSession,
  IListExpenseReportsFromSession,
  IOpenExpenseReportFromSession,
  IRefuseExpenseReportFromSession,
  IReimburseExpenseReportFromSession,
  IRequestExpenseReportInformationFromSession,
  IRemoveExpenseFromSession,
  ISubmitExpenseReportFromSession,
  IUpdateExpenseFromSession,
  IValidateExpenseReportFromSession,
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
    private readonly openFromSession: IOpenExpenseReportFromSession,
    private readonly requestInformationFromSession: IRequestExpenseReportInformationFromSession,
    private readonly validateFromSession: IValidateExpenseReportFromSession,
    private readonly refuseFromSession: IRefuseExpenseReportFromSession,
    private readonly reimburseFromSession: IReimburseExpenseReportFromSession,
    private readonly indicatorsFromSession: IGetExpenseReportIndicatorsFromSession,
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

  openReport(reportId: string): Promise<ExpenseReportSnapshot> {
    return this.openFromSession.execute(reportId);
  }

  requestInformation(reportId: string): Promise<ExpenseReportSnapshot> {
    return this.requestInformationFromSession.execute(reportId);
  }

  validateReport(reportId: string): Promise<ExpenseReportSnapshot> {
    return this.validateFromSession.execute(reportId);
  }

  refuseReport(reportId: string): Promise<ExpenseReportSnapshot> {
    return this.refuseFromSession.execute(reportId);
  }

  reimburseReport(reportId: string): Promise<ExpenseReportSnapshot> {
    return this.reimburseFromSession.execute(reportId);
  }

  getIndicators(): Promise<ExpenseReportIndicators> {
    return this.indicatorsFromSession.execute();
  }

  getReport(reportId: string): Promise<ExpenseReportSnapshot> {
    return this.getFromSession.execute(reportId);
  }

  listReports(
    filter?: ExpenseReportFilterInput,
  ): Promise<ExpenseReportListSnapshot> {
    return this.listFromSession.execute(filter);
  }
}
