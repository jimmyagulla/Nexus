import {
  CompanyScopedSession,
  ExpenseReportSnapshot,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportGateway,
  IRemoveExpenseFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class RemoveExpenseFromSessionUseCase
  implements IRemoveExpenseFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly reports: IExpenseReportGateway,
  ) {}

  async execute(input: {
    reportId: string;
    expenseId: string;
  }): Promise<ExpenseReportSnapshot> {
    const session = await this.currentCompanySession();
    return this.reports.removeExpense(
      session.companyId,
      input.reportId,
      input.expenseId,
      session.token,
    );
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
