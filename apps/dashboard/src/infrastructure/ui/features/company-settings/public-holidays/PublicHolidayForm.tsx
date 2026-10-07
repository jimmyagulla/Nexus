import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../../../common/errors/SubmissionError';
import { Button } from '../../../shared/button';
import { Input } from '../../../shared/input';
import { i18n } from '../../../i18n/i18n';
import {
  publicHolidaySchema,
  type PublicHolidayValues,
} from './public-holiday.schema';

interface PublicHolidayFormProps {
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (values: PublicHolidayValues) => Promise<boolean>;
}

export function PublicHolidayForm({
  errorPresenter,
  submissionError,
  onSubmit,
}: PublicHolidayFormProps) {
  const form = useForm<PublicHolidayValues>({
    resolver: zodResolver(publicHolidaySchema),
    defaultValues: { date: '', label: '' },
  });
  const dateError = form.formState.errors.date;
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
        <label className="block text-sm" htmlFor="holiday-date">
          {i18n.messages.settings.date}
        </label>
        <Input id="holiday-date" type="date" {...form.register('date')} />
        {dateError ? <p>{errorPresenter.present(dateError.message)}</p> : null}
      </div>
      <div>
        <label className="block text-sm" htmlFor="holiday-label">
          {i18n.messages.settings.label}
        </label>
        <Input id="holiday-label" {...form.register('label')} />
        {labelError ? (
          <p>{errorPresenter.present(labelError.message)}</p>
        ) : null}
      </div>
      <SubmissionError message={submissionError} />
      <Button type="submit">{i18n.messages.settings.addHoliday}</Button>
    </form>
  );
}
