import {
  ActorContext,
  ExpenseDetails,
  ExpenseDetailsInput,
  ExpenseReport,
  ExpenseReportSnapshot,
  requireActiveEmployeeActor,
  requireOfferedExpenseCategory,
  requireOwnExpenseReport,
  toExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IAddExpense,
  IEmployeeRepository,
  IExpenseCategoryRepository,
  IExpenseReportRepository,
} from '@hexagonal-monorepo-template/ports';

export class AddExpenseUseCase implements IAddExpense {
  constructor(
    private readonly employees: IEmployeeRepository,
    private readonly reports: IExpenseReportRepository,
    private readonly categories: IExpenseCategoryRepository,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
    expense: ExpenseDetailsInput;
  }): Promise<ExpenseReportSnapshot> {
    requireActiveEmployeeActor(
      input.actor,
      input.companyId,
      await this.employees.findById(input.companyId, input.actor.userId),
    );
    const report = await this.loadDraftReport(input);
    const details = ExpenseDetails.parse(input.expense);
    requireOfferedExpenseCategory(
      input.companyId,
      await this.categories.listByCompany(input.companyId),
      details.categoryId,
    );
    const expense = await this.reports.insertExpense(report.id, details);
    return toExpenseReportSnapshot(report.addExpense(expense));
  }

  private async loadDraftReport(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
  }): Promise<ExpenseReport> {
    const report = requireOwnExpenseReport(
      await this.reports.findById(input.companyId, input.reportId),
      input.actor,
    );
    report.requireDraft();
    return report;
  }
}
