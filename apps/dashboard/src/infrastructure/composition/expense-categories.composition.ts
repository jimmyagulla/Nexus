import {
  AddExpenseCategoryFromSessionUseCase,
  ListExpenseCategoriesFromSessionUseCase,
} from '@hexagonal-monorepo-template/application';
import { ApiExpenseCategoryGateway } from '@hexagonal-monorepo-template/adapters';
import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { ExpenseCategoriesController } from '../../adapters/controllers/expense-categories.controller';
import { ErrorPresenter } from '../../adapters/presenters/error.presenter';
import { ExpenseCategoryPresenter } from '../../adapters/presenters/expense-category.presenter';

export type ExpenseCategoriesComposition = {
  controller: ExpenseCategoriesController;
  presenter: ExpenseCategoryPresenter;
  errorPresenter: ErrorPresenter;
};

export function createExpenseCategoriesComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
): ExpenseCategoriesComposition {
  const categories = new ApiExpenseCategoryGateway(httpClient);

  return {
    controller: new ExpenseCategoriesController(
      new ListExpenseCategoriesFromSessionUseCase(sessions, categories),
      new AddExpenseCategoryFromSessionUseCase(sessions, categories),
    ),
    presenter: new ExpenseCategoryPresenter(),
    errorPresenter: new ErrorPresenter(),
  };
}
