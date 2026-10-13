import {
  CompanyScopedSession,
  PresenceListSnapshot,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IListPresencesFromSession,
  IPresenceGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class ListPresencesFromSessionUseCase
  implements IListPresencesFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly presences: IPresenceGateway,
  ) {}

  async execute(): Promise<PresenceListSnapshot> {
    const session = await this.currentCompanySession();
    return this.presences.list(session.companyId, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
