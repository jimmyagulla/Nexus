import {
  AccountSummary,
  CompanyScopedSession,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IAccountGateway,
  IListCompanyAccountsFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class ListCompanyAccountsFromSessionUseCase
  implements IListCompanyAccountsFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly accounts: IAccountGateway,
  ) {}

  async execute(): Promise<readonly AccountSummary[]> {
    const session = await this.currentCompanySession();
    return this.accounts.listByCompany(session.companyId, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
