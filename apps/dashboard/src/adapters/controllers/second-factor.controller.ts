import {
  SecondFactorEnrollment,
  SecondFactorEnrollmentConfirmation,
} from '@hexagonal-monorepo-template/domain';
import {
  IBeginSecondFactorEnrollmentFromSession,
  IConfirmSecondFactorEnrollmentFromSession,
} from '@hexagonal-monorepo-template/ports';

export class SecondFactorController {
  constructor(
    private readonly beginFromSession: IBeginSecondFactorEnrollmentFromSession,
    private readonly confirmFromSession: IConfirmSecondFactorEnrollmentFromSession,
  ) {}

  beginEnrollment(): Promise<SecondFactorEnrollment> {
    return this.beginFromSession.execute();
  }

  confirmEnrollment(
    code: string,
  ): Promise<SecondFactorEnrollmentConfirmation> {
    return this.confirmFromSession.execute(code);
  }
}
