import {
  CompanyScopedSession,
  requireCompanyScopedSession,
  SecondFactorChallenge,
} from '@hexagonal-monorepo-template/domain';
import {
  IOpenSecondFactorChallengeFromSession,
  ISecondFactorGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class OpenSecondFactorChallengeFromSessionUseCase
  implements IOpenSecondFactorChallengeFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly secondFactors: ISecondFactorGateway,
  ) {}

  async execute(): Promise<SecondFactorChallenge> {
    const session = await this.currentSession();
    const challenge = await this.secondFactors.openChallenge(session.token);
    await this.sessions.refresh();
    return challenge;
  }

  private async currentSession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
