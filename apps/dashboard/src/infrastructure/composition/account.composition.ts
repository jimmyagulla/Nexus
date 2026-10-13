import {
  ActivateAccountViaGatewayUseCase,
  SignInViaGatewayUseCase,
} from '@hexagonal-monorepo-template/application';
import { ApiAccountGateway } from '@hexagonal-monorepo-template/adapters';
import { IHttpClient } from '@hexagonal-monorepo-template/ports';
import { AccountController } from '../../adapters/controllers/account.controller';
import { ErrorPresenter } from '../../adapters/presenters/error.presenter';

export type AccountComposition = {
  controller: AccountController;
  errorPresenter: ErrorPresenter;
};

export function createAccountComposition(
  httpClient: IHttpClient,
): AccountComposition {
  const accounts = new ApiAccountGateway(httpClient);
  return {
    controller: new AccountController(
      new ActivateAccountViaGatewayUseCase(accounts),
      new SignInViaGatewayUseCase(accounts),
    ),
    errorPresenter: new ErrorPresenter(),
  };
}
