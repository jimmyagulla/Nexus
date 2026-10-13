import {
  CompanyScopedSession,
  ExpenseCategorySnapshot,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IAddExpenseCategoryFromSession,
  IExpenseCategoryGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class AddExpenseCategoryFromSessionUseCase
  implements IAddExpenseCategoryFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly categories: IExpenseCategoryGateway,
  ) {}

  async execute(label: string): Promise<readonly ExpenseCategorySnapshot[]> {
    const session = await this.currentCompanySession();
    return this.categories.add(session.companyId, label, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
