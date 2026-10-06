import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';
import { Button } from '../../shared/button';
import { Input } from '../../shared/input';
import { fr } from '../../i18n/fr';
import { presentError } from '../../../../adapters/presenters/company-settings.presenter';
import type { CompanySettingsViewModel } from '../../../../adapters/presenters/company-settings.presenter';
import {
  companyNameSchema,
  type CompanyNameValues,
} from './company-name.schema';
import {
  nonWorkingWeekdaysSchema,
  type NonWorkingWeekdaysValues,
} from './non-working-weekdays.schema';
import {
  publicHolidaySchema,
  type PublicHolidayValues,
} from './public-holiday.schema';

type SettingsViewProps = {
  model: CompanySettingsViewModel;
  onRename: (name: string) => Promise<void>;
  onSaveWeekdays: (weekdays: DayOfWeek[]) => Promise<void>;
  onAddHoliday: (input: { date: string; label: string }) => Promise<void>;
  onRemoveHoliday: (id: string) => Promise<void>;
};

export function SettingsView({
  model,
  onRename,
  onSaveWeekdays,
  onAddHoliday,
  onRemoveHoliday,
}: SettingsViewProps) {
  const nameForm = useForm<CompanyNameValues>({
    resolver: zodResolver(companyNameSchema),
    defaultValues: { name: model.name },
  });
  const weekdayForm = useForm<NonWorkingWeekdaysValues>({
    resolver: zodResolver(nonWorkingWeekdaysSchema),
    defaultValues: {
      weekdays: model.weekdays.filter((day) => day.selected).map((day) => day.value),
    },
  });
  const holidayForm = useForm<PublicHolidayValues>({
    resolver: zodResolver(publicHolidaySchema),
    defaultValues: { date: '', label: '' },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">{fr.settings.title}</h1>

      <form
        className="space-y-4"
        onSubmit={nameForm.handleSubmit(async (values) => {
          await onRename(values.name);
        })}
      >
        <label className="block text-sm font-medium" htmlFor="company-name">
          {fr.settings.name}
        </label>
        <Input id="company-name" {...nameForm.register('name')} />
        {nameForm.formState.errors.name ? (
          <p>{presentError(new Error(String(nameForm.formState.errors.name.message)))}</p>
        ) : null}
        <Button type="submit">{fr.settings.saveName}</Button>
      </form>

      <form
        className="space-y-4"
        onSubmit={weekdayForm.handleSubmit(async (values) => {
          await onSaveWeekdays(values.weekdays);
        })}
      >
        <p className="text-sm font-medium">{fr.settings.nonWorkingWeekdays}</p>
        {model.weekdays.map((day) => (
          <label key={day.value} className="flex items-center gap-2">
            <input
              type="checkbox"
              value={day.value}
              defaultChecked={day.selected}
              {...weekdayForm.register('weekdays')}
            />
            {day.label}
          </label>
        ))}
        <Button type="submit">{fr.settings.saveWeekdays}</Button>
      </form>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{fr.settings.publicHolidays}</h2>
        <ul>
          {model.publicHolidays.map((holiday) => (
            <li key={holiday.id} className="flex items-center gap-4 py-2">
              <span>
                {holiday.date} — {holiday.label}
              </span>
              <Button
                type="button"
                variant="outline"
                onClick={() => onRemoveHoliday(holiday.id)}
              >
                {fr.settings.removeHoliday}
              </Button>
            </li>
          ))}
        </ul>
        <form
          className="flex flex-wrap items-end gap-4"
          onSubmit={holidayForm.handleSubmit(async (values) => {
            await onAddHoliday(values);
            holidayForm.reset();
          })}
        >
          <div>
            <label className="block text-sm" htmlFor="holiday-date">
              {fr.settings.date}
            </label>
            <Input id="holiday-date" type="date" {...holidayForm.register('date')} />
          </div>
          <div>
            <label className="block text-sm" htmlFor="holiday-label">
              {fr.settings.label}
            </label>
            <Input id="holiday-label" {...holidayForm.register('label')} />
          </div>
          <Button type="submit">{fr.settings.addHoliday}</Button>
        </form>
      </section>
    </div>
  );
}
