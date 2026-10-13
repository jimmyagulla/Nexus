import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../../common/errors/SubmissionError';
import { Button } from '../../shared/button';
import { Input } from '../../shared/input';
import { i18n } from '../../i18n/i18n';
import {
  enrollmentCodeSchema,
  type EnrollmentCodeValues,
} from './enrollment-code.schema';

interface EnrollmentCodeFormProps {
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (code: string) => Promise<void>;
}

export function EnrollmentCodeForm({
  errorPresenter,
  submissionError,
  onSubmit,
}: EnrollmentCodeFormProps) {
  const form = useForm<EnrollmentCodeValues>({
    resolver: zodResolver(enrollmentCodeSchema),
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
      <label className="block text-sm font-medium" htmlFor="enrollment-code">
        {i18n.messages.enrollment.code}
      </label>
      <Input
        id="enrollment-code"
        inputMode="numeric"
        autoComplete="one-time-code"
        {...form.register('code')}
      />
      {error ? <p>{errorPresenter.present(error.message)}</p> : null}
      <SubmissionError message={submissionError} />
      <Button type="submit">{i18n.messages.enrollment.submit}</Button>
    </form>
  );
}
