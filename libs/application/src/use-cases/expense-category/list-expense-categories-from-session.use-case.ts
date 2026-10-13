import {
  CompanyScopedSession,
  ExpenseCategorySnapshot,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseCategoryGateway,
  IListExpenseCategoriesFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class ListExpenseCategoriesFromSessionUseCase
  implements IListExpenseCategoriesFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly categories: IExpenseCategoryGateway,
  ) {}

  async execute(): Promise<readonly ExpenseCategorySnapshot[]> {
    const session = await this.currentCompanySession();
    return this.categories.list(session.companyId, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
