import {
  ExpenseDetailsInput,
  ExpenseReportListSnapshot,
  ExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IAddExpenseFromSession,
  ICreateExpenseReportFromSession,
  IGetExpenseReportFromSession,
  IListExpenseReportsFromSession,
} from '@hexagonal-monorepo-template/ports';

export class ExpenseReportsController {
  constructor(
    private readonly createFromSession: ICreateExpenseReportFromSession,
    private readonly addExpenseFromSession: IAddExpenseFromSession,
    private readonly getFromSession: IGetExpenseReportFromSession,
    private readonly listFromSession: IListExpenseReportsFromSession,
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

  getReport(reportId: string): Promise<ExpenseReportSnapshot> {
    return this.getFromSession.execute(reportId);
  }

  listReports(): Promise<ExpenseReportListSnapshot> {
    return this.listFromSession.execute();
  }
}
