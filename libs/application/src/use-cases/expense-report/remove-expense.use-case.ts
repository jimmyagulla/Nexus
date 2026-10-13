import {
  ActorContext,
  ExpenseReportSnapshot,
  requireActiveEmployeeActor,
  requireOwnExpenseReport,
  toExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IEmployeeRepository,
  IExpenseReportRepository,
  IRemoveExpense,
} from '@hexagonal-monorepo-template/ports';

export class RemoveExpenseUseCase implements IRemoveExpense {
  constructor(
    private readonly employees: IEmployeeRepository,
    private readonly reports: IExpenseReportRepository,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
    expenseId: string;
  }): Promise<ExpenseReportSnapshot> {
    requireActiveEmployeeActor(
      input.actor,
      input.companyId,
      await this.employees.findById(input.companyId, input.actor.userId),
    );
    const report = requireOwnExpenseReport(
      await this.reports.findById(input.companyId, input.reportId),
      input.actor,
    );
    const updated = report.removeExpense(input.expenseId);
    await this.reports.deleteExpense(report.id, input.expenseId);
    return toExpenseReportSnapshot(updated);
  }
}
