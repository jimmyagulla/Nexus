import {
  ListExpenseReportsFromSessionUseCase,
  ReviseExpenseReportFromSessionUseCase,
  SubmitExpenseReportFromSessionUseCase,
  ViewExpenseReportProofFromSessionUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { ExpenseReportsController } from '../../../adapters/controllers/expense-reports.controller';
import { ApiExpenseReportGateway } from '../../../adapters/gateways/api-expense-report.gateway';
import { CharacterCounterPresenter } from '../../../adapters/presenters/documents/character-counter.presenter';
import { CountLabelPresenter } from '../../../adapters/presenters/documents/count-label.presenter';
import { FileSizePresenter } from '../../../adapters/presenters/documents/file-size.presenter';
import { UploadedFilePresenter } from '../../../adapters/presenters/documents/uploaded-file.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { ExpenseAmountPresenter } from '../../../adapters/presenters/expense-reports/expense-amount.presenter';
import { ExpenseReportActiveFiltersPresenter } from '../../../adapters/presenters/expense-reports/expense-report-active-filters.presenter';
import { ExpenseReportConfirmationPresenter } from '../../../adapters/presenters/expense-reports/expense-report-confirmation.presenter';
import { ExpenseReportDetailPresenter } from '../../../adapters/presenters/expense-reports/expense-report-detail.presenter';
import { ExpenseReportFiltersPresenter } from '../../../adapters/presenters/expense-reports/expense-report-filters.presenter';
import { ExpenseReportFormPresenter } from '../../../adapters/presenters/expense-reports/expense-report-form.presenter';
import { ExpenseReportKpisPresenter } from '../../../adapters/presenters/expense-reports/expense-report-kpis.presenter';
import { ExpenseReportListSummaryPresenter } from '../../../adapters/presenters/expense-reports/expense-report-list-summary.presenter';
import { ExpenseReportRowPresenter } from '../../../adapters/presenters/expense-reports/expense-report-row.presenter';
import { ExpenseReportSortPresenter } from '../../../adapters/presenters/expense-reports/expense-report-sort.presenter';
import { ExpenseVatOptionsPresenter } from '../../../adapters/presenters/expense-reports/expense-vat-options.presenter';
import { RemoteFileReader } from '../../network/remote-file-reader';
import { i18n } from '../../ui/i18n/i18n';

/** Presenters of the expense reports list: one per view model. */
export type ExpenseReportsListPresenters = {
  kpis: ExpenseReportKpisPresenter;
  summary: ExpenseReportListSummaryPresenter;
  activeFilters: ExpenseReportActiveFiltersPresenter;
  filters: ExpenseReportFiltersPresenter;
  sort: ExpenseReportSortPresenter;
  row: ExpenseReportRowPresenter;
};

/** Presenters of one report: its detail, its form and the banner once sent. */
export type ExpenseReportPresenters = {
  detail: ExpenseReportDetailPresenter;
  form: ExpenseReportFormPresenter;
  vatOptions: ExpenseVatOptionsPresenter;
  uploadedFile: UploadedFilePresenter;
  counter: CharacterCounterPresenter;
  confirmation: ExpenseReportConfirmationPresenter;
};

export type ExpenseReportsPageComposition = {
  controller: ExpenseReportsController;
  listPresenters: ExpenseReportsListPresenters;
  reportPresenters: ExpenseReportPresenters;
  errorPresenter: ErrorPresenter;
  /** Reads the receipt behind the link of a report. */
  files: RemoteFileReader;
};

export function createExpenseReportsPageComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
): ExpenseReportsPageComposition {
  const reports = new ApiExpenseReportGateway(httpClient);
  const amounts = new ExpenseAmountPresenter();
  const counts = new CountLabelPresenter();
  const sizes = new FileSizePresenter();

  return {
    controller: new ExpenseReportsController(
      new ListExpenseReportsFromSessionUseCase(sessions, reports),
      new SubmitExpenseReportFromSessionUseCase(sessions, reports),
      new ReviseExpenseReportFromSessionUseCase(sessions, reports),
      new ViewExpenseReportProofFromSessionUseCase(sessions, reports),
      { categories: i18n.messages.expenseReports.categories },
    ),
    listPresenters: {
      kpis: new ExpenseReportKpisPresenter(amounts, counts),
      summary: new ExpenseReportListSummaryPresenter(counts),
      activeFilters: new ExpenseReportActiveFiltersPresenter(amounts),
      filters: new ExpenseReportFiltersPresenter(counts),
      sort: new ExpenseReportSortPresenter(),
      row: new ExpenseReportRowPresenter(amounts),
    },
    reportPresenters: {
      detail: new ExpenseReportDetailPresenter(amounts, sizes),
      form: new ExpenseReportFormPresenter(sizes),
      vatOptions: new ExpenseVatOptionsPresenter(amounts),
      uploadedFile: new UploadedFilePresenter(sizes),
      counter: new CharacterCounterPresenter(),
      confirmation: new ExpenseReportConfirmationPresenter(amounts),
    },
    errorPresenter: new ErrorPresenter(),
    files: new RemoteFileReader(httpClient),
  };
}
