import { ActivateAccountViaGatewayUseCase } from '@hexagonal-monorepo-template/application';
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
  return {
    controller: new AccountController(
      new ActivateAccountViaGatewayUseCase(new ApiAccountGateway(httpClient)),
    ),
    errorPresenter: new ErrorPresenter(),
  };
}
