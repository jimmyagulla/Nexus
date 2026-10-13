import {
  AccountSummary,
  CompanyScopedSession,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IAccountGateway,
  IRestoreAccountFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class RestoreAccountFromSessionUseCase
  implements IRestoreAccountFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly accounts: IAccountGateway,
  ) {}

  async execute(accountId: string): Promise<AccountSummary> {
    const session = await this.currentCompanySession();
    return this.accounts.restore(session.companyId, accountId, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
