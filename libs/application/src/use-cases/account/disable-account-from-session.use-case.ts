import {
  AccountSummary,
  CompanyScopedSession,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IAccountGateway,
  IDisableAccountFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class DisableAccountFromSessionUseCase
  implements IDisableAccountFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly accounts: IAccountGateway,
  ) {}

  async execute(accountId: string): Promise<AccountSummary> {
    const session = await this.currentCompanySession();
    return this.accounts.disable(session.companyId, accountId, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
