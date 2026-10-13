import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../../../common/errors/SubmissionError';
import { i18n } from '../../../i18n/i18n';
import { Button } from '../../../shared/button';
import { Input } from '../../../shared/input';
import {
  inviteEmployerSchema,
  type InviteEmployerValues,
} from './invite-employer.schema';

interface InviteEmployerFormProps {
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  busy: boolean;
  onSubmit: (identifier: string) => Promise<boolean>;
}

export function InviteEmployerForm({
  errorPresenter,
  submissionError,
  busy,
  onSubmit,
}: InviteEmployerFormProps) {
  const form = useForm<InviteEmployerValues>({
    resolver: zodResolver(inviteEmployerSchema),
    defaultValues: { identifier: '' },
  });
  const error = form.formState.errors.identifier;

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        if (await onSubmit(values.identifier)) {
          form.reset();
        }
      })}
    >
      <label className="block text-sm font-medium" htmlFor="invite-identifier">
        {i18n.messages.accounts.identifier}
      </label>
      <Input id="invite-identifier" {...form.register('identifier')} />
      {error ? <p>{errorPresenter.present(error.message)}</p> : null}
      <SubmissionError message={submissionError} />
      <Button type="submit" disabled={busy}>
        {i18n.messages.accounts.invite}
      </Button>
    </form>
  );
}
