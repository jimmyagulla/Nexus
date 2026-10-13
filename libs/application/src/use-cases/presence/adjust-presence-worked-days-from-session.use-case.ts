import {
  CompanyScopedSession,
  PresenceSnapshot,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IAdjustPresenceWorkedDaysFromSession,
  IPresenceGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class AdjustPresenceWorkedDaysFromSessionUseCase
  implements IAdjustPresenceWorkedDaysFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly presences: IPresenceGateway,
  ) {}

  async execute(input: {
    presenceId: string;
    workedDays: number;
  }): Promise<PresenceSnapshot> {
    const session = await this.currentCompanySession();
    return this.presences.adjustWorkedDays(
      session.companyId,
      input.presenceId,
      input.workedDays,
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
