import {
  AddExpenseFromSessionUseCase,
  CreateExpenseReportFromSessionUseCase,
  GetExpenseReportFromSessionUseCase,
  ListExpenseReportsFromSessionUseCase,
} from '@hexagonal-monorepo-template/application';
import { ApiExpenseReportGateway } from '@hexagonal-monorepo-template/adapters';
import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { ExpenseReportsController } from '../../adapters/controllers/expense-reports.controller';
import { ErrorPresenter } from '../../adapters/presenters/error.presenter';
import { ExpenseReportPresenter } from '../../adapters/presenters/expense-report.presenter';
import type { ExpenseCategoriesComposition } from './expense-categories.composition';

export type ExpenseReportsComposition = {
  controller: ExpenseReportsController;
  presenter: ExpenseReportPresenter;
  errorPresenter: ErrorPresenter;
};

export function createExpenseReportsComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
): ExpenseReportsComposition {
  const reports = new ApiExpenseReportGateway(httpClient);

  return {
    controller: new ExpenseReportsController(
      new CreateExpenseReportFromSessionUseCase(sessions, reports),
      new AddExpenseFromSessionUseCase(sessions, reports),
      new GetExpenseReportFromSessionUseCase(sessions, reports),
      new ListExpenseReportsFromSessionUseCase(sessions, reports),
    ),
    presenter: new ExpenseReportPresenter(),
    errorPresenter: new ErrorPresenter(),
  };
}

export type ExpenseReportsScreenComposition = {
  reports: ExpenseReportsComposition;
  categories: ExpenseCategoriesComposition;
};
