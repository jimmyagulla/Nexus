import {
  ActorContext,
  ExpenseReport,
  ExpenseReportSnapshot,
  ExpenseReportStatus,
  NotificationType,
  requireActiveEmployeeActor,
  requireOwnExpenseReport,
  toExpenseReportNotification,
  toExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IClock,
  IEmployeeRepository,
  IExpenseReportRepository,
  INotificationRepository,
  ISubmitExpenseReport,
} from '@hexagonal-monorepo-template/ports';

export class SubmitExpenseReportUseCase implements ISubmitExpenseReport {
  constructor(
    private readonly employees: IEmployeeRepository,
    private readonly reports: IExpenseReportRepository,
    private readonly notifications: INotificationRepository,
    private readonly clock: IClock,
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
    if (report.status !== ExpenseReportStatus.DRAFT) {
      return toExpenseReportSnapshot(report);
    }
    return toExpenseReportSnapshot(await this.submit(report));
  }

  private async submit(report: ExpenseReport): Promise<ExpenseReport> {
    const submitted = report.submit();
    await this.reports.save(submitted);
    await this.notifications.append(
      toExpenseReportNotification(
        NotificationType.EXPENSE_REPORT_SUBMITTED,
        submitted,
        this.clock.now(),
      ),
    );
    return submitted;
  }
}
