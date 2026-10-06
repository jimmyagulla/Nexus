import { DayOfWeek } from '@hexagonal-monorepo-template/domain';
import type { CompanySettingsViewModel } from '../../../adapters/presenters/company-settings.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../common/SubmissionError';
import { AddPublicHolidayDialog } from '../features/company-settings/AddPublicHolidayDialog';
import { CompanyNameForm } from '../features/company-settings/CompanyNameForm';
import { NonWorkingWeekdaysForm } from '../features/company-settings/NonWorkingWeekdaysForm';
import { PublicHolidayList } from '../features/company-settings/PublicHolidayList';
import type { PublicHolidayValues } from '../features/company-settings/public-holiday.schema';
import { fr } from '../i18n/fr';

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
      <h1 className="text-2xl font-semibold">{fr.settings.title}</h1>

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
        <h2 className="text-xl font-semibold">{fr.settings.publicHolidays}</h2>
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
