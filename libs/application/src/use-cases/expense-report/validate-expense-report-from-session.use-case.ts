import {
  CompanyScopedSession,
  ExpenseReportSnapshot,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportGateway,
  IValidateExpenseReportFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class ValidateExpenseReportFromSessionUseCase implements IValidateExpenseReportFromSession {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly reports: IExpenseReportGateway,
  ) {}

  async execute(reportId: string): Promise<ExpenseReportSnapshot> {
    const session = await this.currentCompanySession();
    return this.reports.validate(session.companyId, reportId, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
