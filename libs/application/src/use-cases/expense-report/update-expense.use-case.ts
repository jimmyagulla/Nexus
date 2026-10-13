import {
  ActorContext,
  Expense,
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
  IEmployeeRepository,
  IExpenseCategoryRepository,
  IExpenseReportRepository,
  IUpdateExpense,
} from '@hexagonal-monorepo-template/ports';

export class UpdateExpenseUseCase implements IUpdateExpense {
  constructor(
    private readonly employees: IEmployeeRepository,
    private readonly reports: IExpenseReportRepository,
    private readonly categories: IExpenseCategoryRepository,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
    expenseId: string;
    expense: ExpenseDetailsInput;
  }): Promise<ExpenseReportSnapshot> {
    requireActiveEmployeeActor(
      input.actor,
      input.companyId,
      await this.employees.findById(input.companyId, input.actor.userId),
    );
    const report = await this.loadOwnReport(input);
    const details = ExpenseDetails.parse(input.expense);
    requireOfferedExpenseCategory(
      input.companyId,
      await this.categories.listByCompany(input.companyId),
      details.categoryId,
    );
    const expense = new Expense(input.expenseId, details);
    const updated = report.updateExpense(expense);
    await this.reports.saveExpense(report.id, expense);
    return toExpenseReportSnapshot(updated);
  }

  private async loadOwnReport(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
  }): Promise<ExpenseReport> {
    return requireOwnExpenseReport(
      await this.reports.findById(input.companyId, input.reportId),
      input.actor,
    );
  }
}
