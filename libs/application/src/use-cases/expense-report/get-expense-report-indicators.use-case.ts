import {
  ActorContext,
  assertSameCompany,
  ExpenseReportIndicators,
  requireActorRole,
  toExpenseReportIndicators,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportRepository,
  IGetExpenseReportIndicators,
} from '@hexagonal-monorepo-template/ports';

export class GetExpenseReportIndicatorsUseCase
  implements IGetExpenseReportIndicators
{
  constructor(private readonly reports: IExpenseReportRepository) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
  }): Promise<ExpenseReportIndicators> {
    requireActorRole(input.actor, UserRole.EMPLOYER, UserRole.EMPLOYEE);
    assertSameCompany(input.companyId, input.actor.companyId);
    const reports = await this.reports.list(
      input.companyId,
      input.actor.role === UserRole.EMPLOYEE
        ? { employeeId: input.actor.userId }
        : {},
    );
    return toExpenseReportIndicators(input.actor.role as UserRole, reports);
  }
}
