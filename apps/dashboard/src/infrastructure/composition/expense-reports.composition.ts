import {
  AddExpenseFromSessionUseCase,
  AttachReceiptFromSessionUseCase,
  CreateExpenseReportFromSessionUseCase,
  GetExpenseReportFromSessionUseCase,
  GetExpenseReportIndicatorsFromSessionUseCase,
  GetReceiptFromSessionUseCase,
  ListExpenseReportsFromSessionUseCase,
  OpenExpenseReportFromSessionUseCase,
  RefuseExpenseReportFromSessionUseCase,
  ReimburseExpenseReportFromSessionUseCase,
  RequestExpenseReportInformationFromSessionUseCase,
  RemoveExpenseFromSessionUseCase,
  SubmitExpenseReportFromSessionUseCase,
  UpdateExpenseFromSessionUseCase,
  ValidateExpenseReportFromSessionUseCase,
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
      new UpdateExpenseFromSessionUseCase(sessions, reports),
      new RemoveExpenseFromSessionUseCase(sessions, reports),
      new AttachReceiptFromSessionUseCase(sessions, reports),
      new SubmitExpenseReportFromSessionUseCase(sessions, reports),
      new GetReceiptFromSessionUseCase(sessions, reports),
      new OpenExpenseReportFromSessionUseCase(sessions, reports),
      new RequestExpenseReportInformationFromSessionUseCase(sessions, reports),
      new ValidateExpenseReportFromSessionUseCase(sessions, reports),
      new RefuseExpenseReportFromSessionUseCase(sessions, reports),
      new ReimburseExpenseReportFromSessionUseCase(sessions, reports),
      new GetExpenseReportIndicatorsFromSessionUseCase(sessions, reports),
    ),
    presenter: new ExpenseReportPresenter(),
    errorPresenter: new ErrorPresenter(),
  };
}

export type ExpenseReportsScreenComposition = {
  reports: ExpenseReportsComposition;
  categories: ExpenseCategoriesComposition;
};
