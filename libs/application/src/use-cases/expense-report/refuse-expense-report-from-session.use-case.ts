import {
  CompanyScopedSession,
  ExpenseReportSnapshot,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportGateway,
  IRefuseExpenseReportFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class RefuseExpenseReportFromSessionUseCase implements IRefuseExpenseReportFromSession {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly reports: IExpenseReportGateway,
  ) {}

  async execute(reportId: string): Promise<ExpenseReportSnapshot> {
    const session = await this.currentCompanySession();
    return this.reports.refuse(session.companyId, reportId, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
