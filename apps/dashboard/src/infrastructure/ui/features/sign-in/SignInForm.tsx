import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../../common/errors/SubmissionError';
import { Button } from '../../shared/button';
import { Input } from '../../shared/input';
import { i18n } from '../../i18n/i18n';
import { signInSchema, type SignInValues } from './sign-in.schema';

interface SignInFormProps {
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (identifier: string, secret: string) => Promise<void>;
}

export function SignInForm({
  errorPresenter,
  submissionError,
  onSubmit,
}: SignInFormProps) {
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { identifier: '', secret: '' },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values.identifier, values.secret);
      })}
    >
      <label className="block text-sm font-medium" htmlFor="sign-in-identifier">
        {i18n.messages.signIn.identifier}
      </label>
      <Input id="sign-in-identifier" {...form.register('identifier')} />
      {form.formState.errors.identifier ? (
        <p>{errorPresenter.present(form.formState.errors.identifier.message)}</p>
      ) : null}
      <label className="block text-sm font-medium" htmlFor="sign-in-secret">
        {i18n.messages.signIn.secret}
      </label>
      <Input id="sign-in-secret" type="password" {...form.register('secret')} />
      {form.formState.errors.secret ? (
        <p>{errorPresenter.present(form.formState.errors.secret.message)}</p>
      ) : null}
      <SubmissionError message={submissionError} />
      <Button type="submit">{i18n.messages.signIn.submit}</Button>
    </form>
  );
}
