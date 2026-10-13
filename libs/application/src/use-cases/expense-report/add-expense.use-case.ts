import {
  ActorContext,
  assertSameCompany,
  ErrorCode,
  ExpenseDetails,
  expenseCategoriesOf,
  ExpenseReport,
  ExpenseReportSnapshot,
  requireActiveEmployee,
  requireActorRole,
  requireOwnExpenseReport,
  toExpenseReportSnapshot,
  UserRole,
  ExpenseDetailsInput,
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
    await this.requireActiveEmployeeOfCompany(input.actor, input.companyId);
    const report = await this.loadDraftReport(input);
    const details = ExpenseDetails.parse(input.expense);
    await this.requireCategoryOfCompany(input.companyId, details.categoryId);
    const expense = await this.reports.insertExpense(report.id, details);
    return toExpenseReportSnapshot(report.addExpense(expense));
  }

  private async requireActiveEmployeeOfCompany(
    actor: ActorContext,
    companyId: string,
  ): Promise<void> {
    requireActorRole(actor, UserRole.EMPLOYEE);
    assertSameCompany(companyId, actor.companyId);
    requireActiveEmployee(await this.employees.findById(companyId, actor.userId));
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

  private async requireCategoryOfCompany(
    companyId: string,
    categoryId: string,
  ): Promise<void> {
    const offered = expenseCategoriesOf(
      companyId,
      await this.categories.listByCompany(companyId),
    );
    if (!offered.some((category) => category.id === categoryId)) {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
  }
}
