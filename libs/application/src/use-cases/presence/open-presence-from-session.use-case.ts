import {
  CompanyScopedSession,
  PresenceSnapshot,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IOpenPresenceFromSession,
  IPresenceGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class OpenPresenceFromSessionUseCase
  implements IOpenPresenceFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly presences: IPresenceGateway,
  ) {}

  async execute(input: {
    employeeId: string;
    month: string;
  }): Promise<PresenceSnapshot> {
    const session = await this.currentCompanySession();
    return this.presences.open(
      session.companyId,
      input.employeeId,
      input.month,
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
