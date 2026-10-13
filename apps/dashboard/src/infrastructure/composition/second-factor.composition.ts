import {
  BeginSecondFactorEnrollmentFromSessionUseCase,
  ConfirmSecondFactorEnrollmentFromSessionUseCase,
} from '@hexagonal-monorepo-template/application';
import { ApiSecondFactorGateway } from '@hexagonal-monorepo-template/adapters';
import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { SecondFactorController } from '../../adapters/controllers/second-factor.controller';
import { ErrorPresenter } from '../../adapters/presenters/error.presenter';
import { SecondFactorEnrollmentPresenter } from '../../adapters/presenters/second-factor-enrollment.presenter';
import { SecondFactorRecoveryCodesPresenter } from '../../adapters/presenters/second-factor-recovery-codes.presenter';

export type SecondFactorComposition = {
  controller: SecondFactorController;
  enrollmentPresenter: SecondFactorEnrollmentPresenter;
  recoveryCodesPresenter: SecondFactorRecoveryCodesPresenter;
  errorPresenter: ErrorPresenter;
};

export function createSecondFactorComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
): SecondFactorComposition {
  const secondFactors = new ApiSecondFactorGateway(httpClient);

  return {
    controller: new SecondFactorController(
      new BeginSecondFactorEnrollmentFromSessionUseCase(
        sessions,
        secondFactors,
      ),
      new ConfirmSecondFactorEnrollmentFromSessionUseCase(
        sessions,
        secondFactors,
      ),
    ),
    enrollmentPresenter: new SecondFactorEnrollmentPresenter(),
    recoveryCodesPresenter: new SecondFactorRecoveryCodesPresenter(),
    errorPresenter: new ErrorPresenter(),
  };
}
