import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../../common/errors/SubmissionError';
import { Button } from '../../shared/button';
import { Input } from '../../shared/input';
import { i18n } from '../../i18n/i18n';
import { activationSchema, type ActivationValues } from './activation.schema';

interface ActivationFormProps {
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (secret: string) => Promise<void>;
}

export function ActivationForm({
  errorPresenter,
  submissionError,
  onSubmit,
}: ActivationFormProps) {
  const form = useForm<ActivationValues>({
    resolver: zodResolver(activationSchema),
    defaultValues: { secret: '' },
  });
  const error = form.formState.errors.secret;

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values.secret);
      })}
    >
      <label className="block text-sm font-medium" htmlFor="activation-secret">
        {i18n.messages.activation.secret}
      </label>
      <Input id="activation-secret" type="password" {...form.register('secret')} />
      {error ? <p>{errorPresenter.present(error.message)}</p> : null}
      <SubmissionError message={submissionError} />
      <Button type="submit">{i18n.messages.activation.submit}</Button>
    </form>
  );
}
