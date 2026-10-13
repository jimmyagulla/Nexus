import {
  CompanyScopedSession,
  requireCompanyScopedSession,
  SecondFactorEnrollment,
} from '@hexagonal-monorepo-template/domain';
import {
  IBeginSecondFactorEnrollmentFromSession,
  ISecondFactorGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class BeginSecondFactorEnrollmentFromSessionUseCase
  implements IBeginSecondFactorEnrollmentFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly secondFactors: ISecondFactorGateway,
  ) {}

  async execute(): Promise<SecondFactorEnrollment> {
    const session = await this.currentSession();
    return this.secondFactors.beginEnrollment(session.token);
  }

  private async currentSession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
