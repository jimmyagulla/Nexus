import {
  ErrorCode,
  Expense,
  ExpenseDetails,
  ExpenseReport,
  ExpenseReportLabel,
} from '@hexagonal-monorepo-template/domain';
import {
  ExpenseReportCriteria,
  IExpenseReportRepository,
} from '@hexagonal-monorepo-template/ports';

export class InMemoryExpenseReportRepository
  implements IExpenseReportRepository
{
  constructor(private readonly reports = new Map<string, ExpenseReport>()) {}

  async insert(
    companyId: string,
    employeeId: string,
    label: ExpenseReportLabel,
  ): Promise<ExpenseReport> {
    const report = ExpenseReport.create(
      globalThis.crypto.randomUUID(),
      companyId,
      employeeId,
      label,
    );
    this.reports.set(report.id, report);
    return report;
  }

  async findById(
    companyId: string,
    reportId: string,
  ): Promise<ExpenseReport | null> {
    const report = this.reports.get(reportId);
    return report?.companyId === companyId ? report : null;
  }

  async insertExpense(
    reportId: string,
    details: ExpenseDetails,
  ): Promise<Expense> {
    const report = this.requireReport(reportId);
    const expense = new Expense(globalThis.crypto.randomUUID(), details);
    this.reports.set(reportId, report.addExpense(expense));
    return expense;
  }

  async saveExpense(reportId: string, expense: Expense): Promise<void> {
    const report = this.requireReport(reportId);
    this.reports.set(reportId, report.updateExpense(expense));
  }

  async deleteExpense(reportId: string, expenseId: string): Promise<void> {
    const report = this.requireReport(reportId);
    this.reports.set(reportId, report.removeExpense(expenseId));
  }

  async list(
    companyId: string,
    criteria: ExpenseReportCriteria,
  ): Promise<readonly ExpenseReport[]> {
    return [...this.reports.values()].filter(
      (report) =>
        report.companyId === companyId &&
        (criteria.employeeId === undefined ||
          report.employeeId === criteria.employeeId),
    );
  }

  private requireReport(reportId: string): ExpenseReport {
    const report = this.reports.get(reportId);
    if (report === undefined) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return report;
  }
}
