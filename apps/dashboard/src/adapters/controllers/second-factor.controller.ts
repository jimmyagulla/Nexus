import {
  SecondFactorChallenge,
  SecondFactorEnrollment,
  SecondFactorEnrollmentConfirmation,
  SecondFactorStatus,
  SecondFactorVerification,
} from '@hexagonal-monorepo-template/domain';
import {
  IBeginSecondFactorEnrollmentFromSession,
  IConfirmSecondFactorEnrollmentFromSession,
  IGetSecondFactorStatusFromSession,
  IOpenSecondFactorChallengeFromSession,
  IVerifySecondFactorFromSession,
} from '@hexagonal-monorepo-template/ports';

export class SecondFactorController {
  constructor(
    private readonly beginFromSession: IBeginSecondFactorEnrollmentFromSession,
    private readonly confirmFromSession: IConfirmSecondFactorEnrollmentFromSession,
    private readonly challengeFromSession: IOpenSecondFactorChallengeFromSession,
    private readonly verifyFromSession: IVerifySecondFactorFromSession,
    private readonly statusFromSession: IGetSecondFactorStatusFromSession,
  ) {}

  getStatus(): Promise<SecondFactorStatus> {
    return this.statusFromSession.execute();
  }

  openChallenge(): Promise<SecondFactorChallenge> {
    return this.challengeFromSession.execute();
  }

  beginEnrollment(): Promise<SecondFactorEnrollment> {
    return this.beginFromSession.execute();
  }

  confirmEnrollment(
    code: string,
  ): Promise<SecondFactorEnrollmentConfirmation> {
    return this.confirmFromSession.execute(code);
  }

  verify(code: string): Promise<SecondFactorVerification> {
    return this.verifyFromSession.execute(code);
  }
}
