import {
  CompanyScopedSession,
  requireCompanyScopedSession,
  SecondFactorVerification,
} from '@hexagonal-monorepo-template/domain';
import {
  ISecondFactorGateway,
  ISessionGateway,
  IVerifySecondFactorFromSession,
} from '@hexagonal-monorepo-template/ports';

export class VerifySecondFactorFromSessionUseCase
  implements IVerifySecondFactorFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly secondFactors: ISecondFactorGateway,
  ) {}

  async execute(code: string): Promise<SecondFactorVerification> {
    const session = await this.currentSession();
    const verification = await this.secondFactors.verify(code, session.token);
    await this.sessions.refresh();
    return verification;
  }

  private async currentSession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
