import {
  CompanyScopedSession,
  requireCompanyScopedSession,
  SecondFactorEnrollmentConfirmation,
} from '@hexagonal-monorepo-template/domain';
import {
  IConfirmSecondFactorEnrollmentFromSession,
  ISecondFactorGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class ConfirmSecondFactorEnrollmentFromSessionUseCase
  implements IConfirmSecondFactorEnrollmentFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly secondFactors: ISecondFactorGateway,
  ) {}

  async execute(code: string): Promise<SecondFactorEnrollmentConfirmation> {
    const session = await this.currentSession();
    const confirmation = await this.secondFactors.confirmEnrollment(
      code,
      session.token,
    );
    await this.sessions.refresh();
    return confirmation;
  }

  private async currentSession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
