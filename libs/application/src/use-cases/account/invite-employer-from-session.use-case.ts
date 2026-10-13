import {
  CompanyScopedSession,
  InvitedAccount,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IAccountGateway,
  IInviteEmployerFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class InviteEmployerFromSessionUseCase
  implements IInviteEmployerFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly accounts: IAccountGateway,
  ) {}

  async execute(identifier: string): Promise<InvitedAccount> {
    const session = await this.currentCompanySession();
    return this.accounts.invite(session.companyId, identifier, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
