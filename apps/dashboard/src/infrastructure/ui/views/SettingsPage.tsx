import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { CompanySettingsComposition } from '../../composition/company-settings.composition';
import { useAddPublicHoliday } from '../hooks/useAddPublicHoliday';
import { useGetCompanySettings } from '../hooks/useGetCompanySettings';
import { useRemovePublicHoliday } from '../hooks/useRemovePublicHoliday';
import { useRenameCompany } from '../hooks/useRenameCompany';
import { useSetNonWorkingWeekdays } from '../hooks/useSetNonWorkingWeekdays';
import { fr } from '../i18n/fr';
import { Settings } from './Settings';

interface SettingsPageProps {
  deps: CompanySettingsComposition;
}

export function SettingsPage({ deps }: SettingsPageProps) {
  const settings = useGetCompanySettings(deps);
  const rename = useRenameCompany(deps);
  const weekdays = useSetNonWorkingWeekdays(deps);
  const addHoliday = useAddPublicHoliday(deps);
  const removeHoliday = useRemovePublicHoliday(deps);

  if (settings.isPending) {
    return <p>{fr.loading}</p>;
  }

  if (settings.isError) {
    return <p>{deps.errorPresenter.present(settings.error)}</p>;
  }

  return (
    <Settings
      model={settings.data}
      errorPresenter={deps.errorPresenter}
      renameError={refusalOf(deps.errorPresenter, rename)}
      onRename={async (name) => {
        await accepted(rename.mutateAsync(name));
      }}
      weekdaysError={refusalOf(deps.errorPresenter, weekdays)}
      onSaveWeekdays={async (days) => {
        await accepted(weekdays.mutateAsync(days));
      }}
      addHolidayError={refusalOf(deps.errorPresenter, addHoliday)}
      onAddHoliday={(values) => accepted(addHoliday.mutateAsync(values))}
      removeHolidayError={refusalOf(deps.errorPresenter, removeHoliday)}
      onRemoveHoliday={(publicHolidayId) =>
        removeHoliday.mutate(publicHolidayId)
      }
    />
  );
}

function refusalOf(
  presenter: ErrorPresenter,
  mutation: { isError: boolean; error: unknown },
): string | null {
  return mutation.isError ? presenter.present(mutation.error) : null;
}

function accepted(mutation: Promise<unknown>): Promise<boolean> {
  return mutation.then(
    () => true,
    () => false,
  );
}
