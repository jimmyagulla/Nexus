import {
  ActorContext,
  assertSameCompany,
  ExpenseReportSnapshot,
  requireActorRole,
  requireOwnExpenseReport,
  toExpenseReportSnapshot,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportRepository,
  IGetExpenseReport,
} from '@hexagonal-monorepo-template/ports';

export class GetExpenseReportUseCase implements IGetExpenseReport {
  constructor(private readonly reports: IExpenseReportRepository) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
  }): Promise<ExpenseReportSnapshot> {
    requireActorRole(input.actor, UserRole.EMPLOYEE);
    assertSameCompany(input.companyId, input.actor.companyId);
    const report = requireOwnExpenseReport(
      await this.reports.findById(input.companyId, input.reportId),
      input.actor,
    );
    return toExpenseReportSnapshot(report);
  }
}
