import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { CompanySettingsComposition } from '../../../composition/company-settings.composition';
import { useAddPublicHoliday } from '../../hooks/company-settings/useAddPublicHoliday';
import { useGetCompanySettings } from '../../hooks/company-settings/useGetCompanySettings';
import { useRemovePublicHoliday } from '../../hooks/company-settings/useRemovePublicHoliday';
import { useRenameCompany } from '../../hooks/company-settings/useRenameCompany';
import { useSetNonWorkingWeekdays } from '../../hooks/company-settings/useSetNonWorkingWeekdays';
import { i18n } from '../../i18n/i18n';
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
    return <p>{i18n.messages.loading}</p>;
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
