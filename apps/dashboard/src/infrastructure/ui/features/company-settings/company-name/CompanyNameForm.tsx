import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../../../common/errors/SubmissionError';
import { Button } from '../../../shared/button';
import { Input } from '../../../shared/input';
import { i18n } from '../../../i18n/i18n';
import { companyNameSchema, type CompanyNameValues } from './company-name.schema';

interface CompanyNameFormProps {
  name: string;
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (name: string) => Promise<void>;
}

export function CompanyNameForm({
  name,
  errorPresenter,
  submissionError,
  onSubmit,
}: CompanyNameFormProps) {
  const form = useForm<CompanyNameValues>({
    resolver: zodResolver(companyNameSchema),
    defaultValues: { name },
  });
  const error = form.formState.errors.name;

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values.name);
      })}
    >
      <label className="block text-sm font-medium" htmlFor="company-name">
        {i18n.messages.settings.name}
      </label>
      <Input id="company-name" {...form.register('name')} />
      {error ? <p>{errorPresenter.present(error.message)}</p> : null}
      <SubmissionError message={submissionError} />
      <Button type="submit">{i18n.messages.settings.saveName}</Button>
    </form>
  );
}
