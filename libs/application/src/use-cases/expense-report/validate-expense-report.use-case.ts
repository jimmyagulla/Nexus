import {
  ActorContext,
  ExpenseReportAuditKind,
  ExpenseReportSnapshot,
  NotificationType,
  requireEmployerActor,
  requireVisibleExpenseReport,
  toExpenseReportAuditEvent,
  toExpenseReportNotification,
  toExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IAuditLogRepository,
  IClock,
  IExpenseReportRepository,
  INotificationRepository,
  IValidateExpenseReport,
} from '@hexagonal-monorepo-template/ports';

export class ValidateExpenseReportUseCase implements IValidateExpenseReport {
  constructor(
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
    requireEmployerActor(input.actor, input.companyId);
    const report = requireVisibleExpenseReport(
      await this.reports.findById(input.companyId, input.reportId),
      input.actor,
    );
    const decided = report.validate();
    const now = this.clock.now();
    await this.reports.save(decided);
    await this.notifications.append(
      toExpenseReportNotification(NotificationType.EXPENSE_REPORT_VALIDATED, decided, now),
    );
    await this.audits.append(
      toExpenseReportAuditEvent({
        kind: ExpenseReportAuditKind.VALIDATED,
        actorId: input.actor.userId,
        before: report,
        after: decided,
        occurredAt: now,
      }),
    );
    return toExpenseReportSnapshot(decided);
  }
}
