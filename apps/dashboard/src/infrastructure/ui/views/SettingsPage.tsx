import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CompanySettingsSnapshot,
  DayOfWeek,
} from '@hexagonal-monorepo-template/domain';
import {
  presentCompanySettings,
  presentError,
} from '../../../adapters/presenters/company-settings.presenter';
import { SettingsView } from '../features/company-settings/SettingsView';
import { fr } from '../i18n/fr';

export type CompanySettingsApi = {
  getSettings(): Promise<CompanySettingsSnapshot>;
  renameCompany(name: string): Promise<CompanySettingsSnapshot>;
  updateNonWorkingWeekdays(
    weekdays: readonly DayOfWeek[],
  ): Promise<CompanySettingsSnapshot>;
  addPublicHoliday(input: {
    date: string;
    label: string;
  }): Promise<CompanySettingsSnapshot>;
  removePublicHoliday(publicHolidayId: string): Promise<CompanySettingsSnapshot>;
};

type SettingsPageProps = {
  controller: CompanySettingsApi;
};

export function SettingsPage({ controller }: SettingsPageProps) {
  const queryClient = useQueryClient();
  const settingsQuery = useQuery({
    queryKey: ['company-settings'],
    queryFn: () => controller.getSettings(),
  });
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['company-settings'] });

  const rename = useMutation({
    mutationFn: (name: string) => controller.renameCompany(name),
    onSuccess: invalidate,
  });
  const weekdays = useMutation({
    mutationFn: (days: DayOfWeek[]) =>
      controller.updateNonWorkingWeekdays(days),
    onSuccess: invalidate,
  });
  const addHoliday = useMutation({
    mutationFn: (input: { date: string; label: string }) =>
      controller.addPublicHoliday(input),
    onSuccess: invalidate,
  });
  const removeHoliday = useMutation({
    mutationFn: (id: string) => controller.removePublicHoliday(id),
    onSuccess: invalidate,
  });

  if (settingsQuery.isPending) {
    return <p>{fr.loading}</p>;
  }
  if (settingsQuery.isError) {
    return <p>{presentError(settingsQuery.error)}</p>;
  }

  return (
    <SettingsView
      model={presentCompanySettings(settingsQuery.data)}
      onRename={(name) => rename.mutateAsync(name)}
      onSaveWeekdays={(days) => weekdays.mutateAsync(days)}
      onAddHoliday={(input) => addHoliday.mutateAsync(input)}
      onRemoveHoliday={(id) => removeHoliday.mutateAsync(id)}
    />
  );
}
