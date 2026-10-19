import type { UseFormReturn } from 'react-hook-form';
import type { CharacterCounterPresenter } from '../../../../adapters/presenters/documents/character-counter.presenter';
import type { UploadedFilePresenter } from '../../../../adapters/presenters/documents/uploaded-file.presenter';
import type { ExpenseReportFormModel } from '../../../../adapters/presenters/expense-reports/expense-report-form.presenter';
import type { ExpenseVatOptionsPresenter } from '../../../../adapters/presenters/expense-reports/expense-vat-options.presenter';
import type { ExpenseReportValues } from './expense-report.schema';

/** What the fields of the expense report form receive from the form that owns their state. */
export interface ExpenseReportFieldsProps {
  form: UseFormReturn<ExpenseReportValues>;
  model: ExpenseReportFormModel;
  vatOptionsPresenter: ExpenseVatOptionsPresenter;
  uploadedFilePresenter: UploadedFilePresenter;
  counterPresenter: CharacterCounterPresenter;
  /** Translates the error code of a field; null without error. */
  describeError: (code: string | undefined) => string | null;
}
