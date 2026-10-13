import {
  ActorContext,
  ExpenseReportSnapshot,
  NotificationType,
  requireEmployerActor,
  requireVisibleExpenseReport,
  toExpenseReportNotification,
  toExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IClock,
  IExpenseReportRepository,
  INotificationRepository,
  IRefuseExpenseReport,
} from '@hexagonal-monorepo-template/ports';

export class RefuseExpenseReportUseCase implements IRefuseExpenseReport {
  constructor(
    private readonly reports: IExpenseReportRepository,
    private readonly notifications: INotificationRepository,
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
    const decided = report.refuse();
    await this.reports.save(decided);
    await this.notifications.append(
      toExpenseReportNotification(
        NotificationType.EXPENSE_REPORT_REFUSED,
        decided,
        this.clock.now(),
      ),
    );
    return toExpenseReportSnapshot(decided);
  }
}
