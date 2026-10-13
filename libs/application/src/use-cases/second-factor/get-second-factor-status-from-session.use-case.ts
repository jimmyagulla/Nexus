import {
  CompanyScopedSession,
  requireCompanyScopedSession,
  SecondFactorStatus,
} from '@hexagonal-monorepo-template/domain';
import {
  IGetSecondFactorStatusFromSession,
  ISecondFactorGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class GetSecondFactorStatusFromSessionUseCase
  implements IGetSecondFactorStatusFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly secondFactors: ISecondFactorGateway,
  ) {}

  async execute(): Promise<SecondFactorStatus> {
    const session = await this.currentSession();
    return this.secondFactors.getStatus(session.token);
  }

  private async currentSession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
