import {
  CompanyScopedSession,
  ExpenseDetailsInput,
  ExpenseReportSnapshot,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportGateway,
  ISessionGateway,
  IUpdateExpenseFromSession,
} from '@hexagonal-monorepo-template/ports';

export class UpdateExpenseFromSessionUseCase
  implements IUpdateExpenseFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly reports: IExpenseReportGateway,
  ) {}

  async execute(input: {
    reportId: string;
    expenseId: string;
    expense: ExpenseDetailsInput;
  }): Promise<ExpenseReportSnapshot> {
    const session = await this.currentCompanySession();
    return this.reports.updateExpense(
      session.companyId,
      input.reportId,
      input.expenseId,
      input.expense,
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
