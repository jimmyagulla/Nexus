import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EXCHANGE_FILE_MIME_TYPES } from '@hexagonal-monorepo-template/domain';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../../../common/errors/SubmissionError';
import { Button } from '../../../shared/button';
import { Input } from '../../../shared/input';
import { i18n } from '../../../i18n/i18n';
import {
  newExchangeSchema,
  type NewExchangeFormValues,
  type NewExchangeValues,
} from './new-exchange.schema';

interface NewExchangeFormProps {
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  submitLabel: string;
  onSubmit: (values: NewExchangeValues) => Promise<boolean>;
}

export function NewExchangeForm({
  errorPresenter,
  submissionError,
  submitLabel,
  onSubmit,
}: NewExchangeFormProps) {
  const form = useForm<NewExchangeFormValues>({
    resolver: zodResolver(newExchangeSchema),
    defaultValues: { category: '' },
  });
  const categoryError = form.formState.errors.category;
  const fileError = form.formState.errors.file;

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        const file = values.file[0];
        if (file !== undefined && (await onSubmit({ category: values.category, file }))) {
          form.reset();
        }
      })}
    >
      <div>
        <label className="block text-sm" htmlFor="exchange-category">
          {i18n.messages.cabinet.category}
        </label>
        <Input id="exchange-category" {...form.register('category')} />
        {categoryError ? (
          <p>{errorPresenter.present(categoryError.message)}</p>
        ) : null}
      </div>
      <div>
        <label className="block text-sm" htmlFor="exchange-file">
          {i18n.messages.cabinet.file}
        </label>
        <Input
          id="exchange-file"
          type="file"
          accept={EXCHANGE_FILE_MIME_TYPES.join(',')}
          {...form.register('file')}
        />
        {fileError ? <p>{errorPresenter.present(fileError.message)}</p> : null}
      </div>
      <SubmissionError message={submissionError} />
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
