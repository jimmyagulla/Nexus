import {
  DisableAccountFromSessionUseCase,
  InviteEmployerFromSessionUseCase,
  ListCompanyAccountsFromSessionUseCase,
  RestoreAccountFromSessionUseCase,
} from '@hexagonal-monorepo-template/application';
import { ApiAccountGateway } from '@hexagonal-monorepo-template/adapters';
import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { CompanyAccountsController } from '../../adapters/controllers/company-accounts.controller';
import { CompanyAccountsPresenter } from '../../adapters/presenters/company-accounts.presenter';
import { ErrorPresenter } from '../../adapters/presenters/error.presenter';

export type CompanyAccountsComposition = {
  controller: CompanyAccountsController;
  presenter: CompanyAccountsPresenter;
  errorPresenter: ErrorPresenter;
};

export function createCompanyAccountsComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
): CompanyAccountsComposition {
  const accounts = new ApiAccountGateway(httpClient);

  return {
    controller: new CompanyAccountsController(
      new ListCompanyAccountsFromSessionUseCase(sessions, accounts),
      new InviteEmployerFromSessionUseCase(sessions, accounts),
      new DisableAccountFromSessionUseCase(sessions, accounts),
      new RestoreAccountFromSessionUseCase(sessions, accounts),
    ),
    presenter: new CompanyAccountsPresenter(),
    errorPresenter: new ErrorPresenter(),
  };
}
