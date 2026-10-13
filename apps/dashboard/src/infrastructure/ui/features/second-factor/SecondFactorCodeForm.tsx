import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../../common/errors/SubmissionError';
import { Button } from '../../shared/button';
import { Input } from '../../shared/input';
import {
  secondFactorCodeSchema,
  type SecondFactorCodeValues,
} from './second-factor-code.schema';

interface SecondFactorCodeFormProps {
  label: string;
  submitLabel: string;
  schema: typeof secondFactorCodeSchema;
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  pending: boolean;
  onSubmit: (code: string) => Promise<void>;
}

export function SecondFactorCodeForm({
  label,
  submitLabel,
  schema,
  errorPresenter,
  submissionError,
  pending,
  onSubmit,
}: SecondFactorCodeFormProps) {
  const form = useForm<SecondFactorCodeValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: '' },
  });
  const error = form.formState.errors.code;

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values.code);
      })}
    >
      <label className="block text-sm font-medium" htmlFor="second-factor-code">
        {label}
      </label>
      <Input
        id="second-factor-code"
        autoComplete="one-time-code"
        {...form.register('code')}
      />
      {error ? <p>{errorPresenter.present(error.message)}</p> : null}
      <SubmissionError message={submissionError} />
      <Button type="submit" disabled={pending}>
        {submitLabel}
      </Button>
    </form>
  );
}
