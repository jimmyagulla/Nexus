import {
  CompanyScopedSession,
  ExpenseReportSnapshot,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  ICreateExpenseReportFromSession,
  IExpenseReportGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class CreateExpenseReportFromSessionUseCase
  implements ICreateExpenseReportFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly reports: IExpenseReportGateway,
  ) {}

  async execute(label: string): Promise<ExpenseReportSnapshot> {
    const session = await this.currentCompanySession();
    return this.reports.create(session.companyId, label, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
