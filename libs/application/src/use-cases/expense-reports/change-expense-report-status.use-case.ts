import {
  ActorContext,
  ExpenseReportStatus,
  ExpenseReportSummary,
  requireCompanyExpenseReport,
  toExpenseReportSummary,
} from '@hexagonal-monorepo-template/domain';
import {
  IChangeExpenseReportStatus,
  IClock,
  IExpenseReportRepository,
} from '@hexagonal-monorepo-template/ports';

export class ChangeExpenseReportStatusUseCase implements IChangeExpenseReportStatus {
  constructor(
    private readonly reports: IExpenseReportRepository,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    actor: ActorContext;
    expenseReportId: string;
    status: ExpenseReportStatus;
  }): Promise<ExpenseReportSummary> {
    const report = requireCompanyExpenseReport(
      await this.reports.findById(input.expenseReportId),
      input.actor,
    );
    const changed = report.changeStatus(input.status, this.clock.now());
    if (changed !== report) {
      await this.reports.save(changed);
    }
    return toExpenseReportSummary(changed);
  }
}
