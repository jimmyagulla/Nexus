import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';
import type { WeekdayViewModel } from '../../../../adapters/presenters/company-settings.presenter';
import { SubmissionError } from '../../common/SubmissionError';
import { Button } from '../../shared/button';
import { fr } from '../../i18n/fr';
import {
  nonWorkingWeekdaysSchema,
  type NonWorkingWeekdaysValues,
} from './non-working-weekdays.schema';
import { WeekdayCheckbox } from './WeekdayCheckbox';

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
      <p className="text-sm font-medium">{fr.settings.nonWorkingWeekdays}</p>
      {weekdays.map((weekday) => (
        <WeekdayCheckbox
          key={weekday.value}
          weekday={weekday}
          registration={registration}
        />
      ))}
      <SubmissionError message={submissionError} />
      <Button type="submit">{fr.settings.saveWeekdays}</Button>
    </form>
  );
}
