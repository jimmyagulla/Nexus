import {
  ActorContext,
  ExpenseReport,
  ExpenseReportAuditKind,
  ExpenseReportSnapshot,
  ExpenseReportStatus,
  NotificationType,
  requireActiveEmployeeActor,
  requireOwnExpenseReport,
  toExpenseReportAuditEvent,
  toExpenseReportNotification,
  toExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IAuditLogRepository,
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
    private readonly audits: IAuditLogRepository,
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
    return toExpenseReportSnapshot(await this.submit(input.actor, report));
  }

  private async submit(
    actor: ActorContext,
    report: ExpenseReport,
  ): Promise<ExpenseReport> {
    const submitted = report.submit();
    const now = this.clock.now();
    await this.reports.save(submitted);
    await this.notifications.append(
      toExpenseReportNotification(
        NotificationType.EXPENSE_REPORT_SUBMITTED,
        submitted,
        now,
      ),
    );
    await this.audits.append(
      toExpenseReportAuditEvent({
        kind: ExpenseReportAuditKind.SUBMITTED,
        actorId: actor.userId,
        before: report,
        after: submitted,
        occurredAt: now,
      }),
    );
    return submitted;
  }
}
