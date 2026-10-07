import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';
import type { WeekdayViewModel } from '../../../../../adapters/presenters/company-settings.presenter';
import { SubmissionError } from '../../../common/errors/SubmissionError';
import { Button } from '../../../shared/button';
import { i18n } from '../../../i18n/i18n';
import {
  nonWorkingWeekdaysSchema,
  type NonWorkingWeekdaysValues,
} from './non-working-weekdays.schema';

interface NonWorkingWeekdaysFormProps {
  weekdays: WeekdayViewModel[];
  selectedWeekdays: DayOfWeek[];
  submissionError: string | null;
  onSubmit: (weekdays: DayOfWeek[]) => Promise<void>;
}

export function NonWorkingWeekdaysForm({
  weekdays,
  selectedWeekdays,
  submissionError,
  onSubmit,
}: NonWorkingWeekdaysFormProps) {
  const form = useForm<NonWorkingWeekdaysValues>({
    resolver: zodResolver(nonWorkingWeekdaysSchema),
    defaultValues: { weekdays: selectedWeekdays },
  });
  const registration = form.register('weekdays');

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values.weekdays);
      })}
    >
      <p className="text-sm font-medium">
        {i18n.messages.settings.nonWorkingWeekdays}
      </p>
      {weekdays.map((weekday) => (
        <label key={weekday.value} className="flex items-center gap-2">
          <input
            type="checkbox"
            value={weekday.value}
            defaultChecked={weekday.selected}
            {...registration}
          />
          {weekday.label}
        </label>
      ))}
      <SubmissionError message={submissionError} />
      <Button type="submit">{i18n.messages.settings.saveWeekdays}</Button>
    </form>
  );
}
