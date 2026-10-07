import { DayOfWeek } from '@hexagonal-monorepo-template/domain';
import type { CompanySettingsViewModel } from '../../../adapters/presenters/company-settings.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../common/errors/SubmissionError';
import { CompanyNameForm } from '../features/company-settings/company-name/CompanyNameForm';
import { NonWorkingWeekdaysForm } from '../features/company-settings/non-working-weekdays/NonWorkingWeekdaysForm';
import { AddPublicHolidayDialog } from '../features/company-settings/public-holidays/AddPublicHolidayDialog';
import { PublicHolidayList } from '../features/company-settings/public-holidays/PublicHolidayList';
import type { PublicHolidayValues } from '../features/company-settings/public-holidays/public-holiday.schema';
import { i18n } from '../i18n/i18n';

interface SettingsProps {
  model: CompanySettingsViewModel;
  errorPresenter: ErrorPresenter;
  renameError: string | null;
  weekdaysError: string | null;
  addHolidayError: string | null;
  removeHolidayError: string | null;
  onRename: (name: string) => Promise<void>;
  onSaveWeekdays: (weekdays: DayOfWeek[]) => Promise<void>;
  onAddHoliday: (values: PublicHolidayValues) => Promise<boolean>;
  onRemoveHoliday: (publicHolidayId: string) => void;
}

export function Settings({
  model,
  errorPresenter,
  renameError,
  weekdaysError,
  addHolidayError,
  removeHolidayError,
  onRename,
  onSaveWeekdays,
  onAddHoliday,
  onRemoveHoliday,
}: SettingsProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">{i18n.messages.settings.title}</h1>

      <CompanyNameForm
        name={model.name}
        errorPresenter={errorPresenter}
        submissionError={renameError}
        onSubmit={onRename}
      />

      <NonWorkingWeekdaysForm
        weekdays={model.weekdays}
        selectedWeekdays={model.selectedWeekdays}
        submissionError={weekdaysError}
        onSubmit={onSaveWeekdays}
      />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{i18n.messages.settings.publicHolidays}</h2>
        <PublicHolidayList
          publicHolidays={model.publicHolidays}
          onRemove={onRemoveHoliday}
        />
        <SubmissionError message={removeHolidayError} />
        <AddPublicHolidayDialog
          errorPresenter={errorPresenter}
          submissionError={addHolidayError}
          onSubmit={onAddHoliday}
        />
      </section>
    </div>
  );
}
