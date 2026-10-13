import {
  CompanyScopedSession,
  ExpenseReportFilterInput,
  ExpenseReportListSnapshot,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportGateway,
  IListExpenseReportsFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class ListExpenseReportsFromSessionUseCase
  implements IListExpenseReportsFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly reports: IExpenseReportGateway,
  ) {}

  async execute(
    filter?: ExpenseReportFilterInput,
  ): Promise<ExpenseReportListSnapshot> {
    const session = await this.currentCompanySession();
    return this.reports.list(session.companyId, session.token, filter);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
