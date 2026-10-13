import {
  ActivateAccountViaGatewayUseCase,
  ActivateEmployeeAccountViaGatewayUseCase,
  ConfirmSecondFactorEnrollmentViaGatewayUseCase,
  SignInViaGatewayUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  ApiAccountGateway,
  ApiSecondFactorEnrollmentGateway,
} from '@hexagonal-monorepo-template/adapters';
import { IHttpClient } from '@hexagonal-monorepo-template/ports';
import { AccountController } from '../../adapters/controllers/account.controller';
import { SecondFactorEnrollmentController } from '../../adapters/controllers/second-factor-enrollment.controller';
import { EmployeeEnrollmentPresenter } from '../../adapters/presenters/employee-enrollment.presenter';
import { EmployeeWorkspacePresenter } from '../../adapters/presenters/employee-workspace.presenter';
import { ErrorPresenter } from '../../adapters/presenters/error.presenter';

export type AccountComposition = {
  controller: AccountController;
  enrollmentController: SecondFactorEnrollmentController;
  errorPresenter: ErrorPresenter;
  enrollmentPresenter: EmployeeEnrollmentPresenter;
  workspacePresenter: EmployeeWorkspacePresenter;
};

export function createAccountComposition(
  httpClient: IHttpClient,
): AccountComposition {
  const accounts = new ApiAccountGateway(httpClient);
  const enrollments = new ApiSecondFactorEnrollmentGateway(httpClient);
  return {
    controller: new AccountController(
      new ActivateAccountViaGatewayUseCase(accounts),
      new ActivateEmployeeAccountViaGatewayUseCase(accounts),
      new SignInViaGatewayUseCase(accounts),
    ),
    enrollmentController: new SecondFactorEnrollmentController(
      new ConfirmSecondFactorEnrollmentViaGatewayUseCase(enrollments),
    ),
    errorPresenter: new ErrorPresenter(),
    enrollmentPresenter: new EmployeeEnrollmentPresenter(),
    workspacePresenter: new EmployeeWorkspacePresenter(),
  };
}
