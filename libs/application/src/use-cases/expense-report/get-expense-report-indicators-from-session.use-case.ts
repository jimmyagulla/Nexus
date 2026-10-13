import {
  CompanyScopedSession,
  ExpenseReportIndicators,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportGateway,
  IGetExpenseReportIndicatorsFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class GetExpenseReportIndicatorsFromSessionUseCase
  implements IGetExpenseReportIndicatorsFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly reports: IExpenseReportGateway,
  ) {}

  async execute(): Promise<ExpenseReportIndicators> {
    const session = await this.currentCompanySession();
    return this.reports.indicators(session.companyId, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
