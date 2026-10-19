import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExpenseReportFields } from './ExpenseReportFields';
import {
  expenseReportSchema,
  type ExpenseReportValues,
} from './expense-report.schema';
import type { ExpenseReportFieldsProps } from './expense-report-fields.props';
import type { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';

/** Id of the expense report <form>, for a submit button placed outside of it (`form` attribute). */
export const EXPENSE_REPORT_FORM_ID = 'expense-report-form';

interface ExpenseReportFormProps
  extends Pick<ExpenseReportFieldsProps, 'model' | 'vatOptionsPresenter' | 'uploadedFilePresenter' | 'counterPresenter'> {
  errorPresenter: ErrorPresenter;
  submitting: boolean;
  onSubmit: (values: ExpenseReportValues) => void | Promise<void>;
}

/**
 * The expense report form: its state, its validation and its <form> element.
 * The layout around it (header, footer, submit button) belongs to the view.
 */
export function ExpenseReportForm({
  model,
  vatOptionsPresenter,
  uploadedFilePresenter,
  counterPresenter,
  errorPresenter,
  submitting,
  onSubmit,
}: ExpenseReportFormProps) {
  const form = useForm<ExpenseReportValues>({
    resolver: zodResolver(expenseReportSchema),
    defaultValues: { ...model.defaults, proof: null },
  });

  return (
    <form
      id={EXPENSE_REPORT_FORM_ID}
      noValidate
      aria-busy={submitting}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <ExpenseReportFields
        form={form}
        model={model}
        vatOptionsPresenter={vatOptionsPresenter}
        uploadedFilePresenter={uploadedFilePresenter}
        counterPresenter={counterPresenter}
        describeError={(code) => (code === undefined ? null : errorPresenter.present(code))}
      />
    </form>
  );
}
