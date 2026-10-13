import {
  CompanyScopedSession,
  ExpenseDetailsInput,
  ExpenseReportSnapshot,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IAddExpenseFromSession,
  IExpenseReportGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class AddExpenseFromSessionUseCase implements IAddExpenseFromSession {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly reports: IExpenseReportGateway,
  ) {}

  async execute(input: {
    reportId: string;
    expense: ExpenseDetailsInput;
  }): Promise<ExpenseReportSnapshot> {
    const session = await this.currentCompanySession();
    return this.reports.addExpense(
      session.companyId,
      input.reportId,
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
