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
  ISubmitExpenseReport,
} from '@hexagonal-monorepo-template/ports';

export class SubmitExpenseReportUseCase implements ISubmitExpenseReport {
  constructor(
    private readonly employees: IEmployeeRepository,
    private readonly reports: IExpenseReportRepository,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
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
    const submitted = report.submit();
    await this.reports.save(submitted);
    return toExpenseReportSnapshot(submitted);
  }
}
