import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../../common/errors/SubmissionError';
import { Button } from '../../shared/button';
import { Input } from '../../shared/input';
import { i18n } from '../../i18n/i18n';
import {
  expenseCategorySchema,
  type ExpenseCategoryValues,
} from './expense-category.schema';

interface ExpenseCategoryFormProps {
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (values: ExpenseCategoryValues) => Promise<boolean>;
}

export function ExpenseCategoryForm({
  errorPresenter,
  submissionError,
  onSubmit,
}: ExpenseCategoryFormProps) {
  const form = useForm<ExpenseCategoryValues>({
    resolver: zodResolver(expenseCategorySchema),
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
        <label className="block text-sm" htmlFor="expense-category-label">
          {i18n.messages.expenseCategories.label}
        </label>
        <Input id="expense-category-label" {...form.register('label')} />
        {labelError ? (
          <p>{errorPresenter.present(labelError.message)}</p>
        ) : null}
      </div>
      <SubmissionError message={submissionError} />
      <Button type="submit">{i18n.messages.expenseCategories.add}</Button>
    </form>
  );
}
