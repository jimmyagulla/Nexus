import {
  ActorContext,
  ExpenseReportSnapshot,
  requireEmployerActor,
  requireVisibleExpenseReport,
  toExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportRepository,
  IOpenExpenseReport,
} from '@hexagonal-monorepo-template/ports';

export class OpenExpenseReportUseCase implements IOpenExpenseReport {
  constructor(private readonly reports: IExpenseReportRepository) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
  }): Promise<ExpenseReportSnapshot> {
    requireEmployerActor(input.actor, input.companyId);
    const report = requireVisibleExpenseReport(
      await this.reports.findById(input.companyId, input.reportId),
      input.actor,
    );
    const opened = report.startReview();
    if (opened !== report) {
      await this.reports.save(opened);
    }
    return toExpenseReportSnapshot(opened);
  }
}
