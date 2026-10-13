import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../../../common/errors/SubmissionError';
import { Button } from '../../../shared/button';
import { Input } from '../../../shared/input';
import { i18n } from '../../../i18n/i18n';
import {
  adjustWorkedDaysSchema,
  type AdjustWorkedDaysValues,
} from './adjust-worked-days.schema';

interface AdjustWorkedDaysFormProps {
  workedDays: number;
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (values: AdjustWorkedDaysValues) => Promise<boolean>;
}

export function AdjustWorkedDaysForm({
  workedDays,
  errorPresenter,
  submissionError,
  onSubmit,
}: AdjustWorkedDaysFormProps) {
  const form = useForm<AdjustWorkedDaysValues>({
    resolver: zodResolver(adjustWorkedDaysSchema),
    defaultValues: { workedDays },
  });
  const daysError = form.formState.errors.workedDays;

  return (
    <form
      className="flex flex-wrap items-end gap-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div>
        <label className="block text-sm" htmlFor="presence-worked-days">
          {i18n.messages.presences.workedDays}
        </label>
        <Input
          id="presence-worked-days"
          type="number"
          step="any"
          {...form.register('workedDays', { valueAsNumber: true })}
        />
        {daysError ? <p>{errorPresenter.present(daysError.message)}</p> : null}
      </div>
      <SubmissionError message={submissionError} />
      <Button type="submit">{i18n.messages.presences.save}</Button>
    </form>
  );
}
