import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../../../common/errors/SubmissionError';
import { Button } from '../../../shared/button';
import { Input } from '../../../shared/input';
import { i18n } from '../../../i18n/i18n';
import {
  createExpenseReportSchema,
  type CreateExpenseReportValues,
} from './create-expense-report.schema';

interface CreateExpenseReportFormProps {
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (values: CreateExpenseReportValues) => Promise<boolean>;
}

export function CreateExpenseReportForm({
  errorPresenter,
  submissionError,
  onSubmit,
}: CreateExpenseReportFormProps) {
  const form = useForm<CreateExpenseReportValues>({
    resolver: zodResolver(createExpenseReportSchema),
    defaultValues: { label: '' },
  });
  const labelError = form.formState.errors.label;

  return (
    <form
      className="flex flex-wrap items-end gap-4"
      onSubmit={form.handleSubmit(async (values) => {
        if (await onSubmit(values)) {
          form.reset();
        }
      })}
    >
      <div>
        <label className="block text-sm" htmlFor="expense-report-label">
          {i18n.messages.expenseReports.label}
        </label>
        <Input id="expense-report-label" {...form.register('label')} />
        {labelError ? (
          <p>{errorPresenter.present(labelError.message)}</p>
        ) : null}
      </div>
      <SubmissionError message={submissionError} />
      <Button type="submit">{i18n.messages.expenseReports.create}</Button>
    </form>
  );
}
