import { useState } from 'react';
import { AuditEventView } from '../../../adapters/presenters/audit-event/audit-event.presenter';
import { useAddCompanyHoliday } from '../hooks/useAddCompanyHoliday';
import { useCreateCompany } from '../hooks/useCreateCompany';
import {
  useGetCompanySettings,
  UseGetCompanySettingsDeps,
} from '../hooks/useGetCompanySettings';
import { useRemoveCompanyHoliday } from '../hooks/useRemoveCompanyHoliday';
import { useRenameCompany } from '../hooks/useRenameCompany';
import { useUpdateNonWorkingWeekdays } from '../hooks/useUpdateNonWorkingWeekdays';
import { getCompanyId } from '../stores/company-session.store';
import { SettingsView } from './SettingsView';

type SettingsPageProps = UseGetCompanySettingsDeps & {
  controller: UseGetCompanySettingsDeps['controller'] &
    Parameters<typeof useCreateCompany>[0]['controller'] &
    Parameters<typeof useRenameCompany>[0]['controller'] &
    Parameters<typeof useUpdateNonWorkingWeekdays>[0]['controller'] &
    Parameters<typeof useAddCompanyHoliday>[0]['controller'] &
    Parameters<typeof useRemoveCompanyHoliday>[0]['controller'];
  auditPresenter: {
    presentMany: (events: readonly AuditEventView[]) => string[];
  };
  auditEvents?: readonly AuditEventView[];
};

export function SettingsPage({
  controller,
  presenter,
  auditPresenter,
  auditEvents = [],
}: SettingsPageProps) {
  const [companyId, setCurrentId] = useState(getCompanyId());
  const settingsQuery = useGetCompanySettings(companyId, { controller, presenter });
  const createCompany = useCreateCompany({ controller });
  const renameCompany = useRenameCompany({ controller });
  const updateWeekdays = useUpdateNonWorkingWeekdays({ controller });
  const addHoliday = useAddCompanyHoliday({ controller });
  const removeHoliday = useRemoveCompanyHoliday({ controller });

  if (companyId !== null && settingsQuery.isLoading) {
    return <p>Chargement…</p>;
  }

  if (settingsQuery.isError) {
    return <p>{settingsQuery.error.message}</p>;
  }

  return (
    <SettingsView
      settings={settingsQuery.data ?? null}
      auditLines={auditPresenter.presentMany(auditEvents)}
      onCreate={async (values) => {
        const created = await createCompany.mutateAsync(values);
        setCurrentId(created.id);
      }}
      onRename={(values) => {
        if (companyId === null) {
          return;
        }
        renameCompany.mutate({ companyId, name: values.name });
      }}
      onWeekdaysChange={(weekdays) => {
        if (companyId === null) {
          return;
        }
        updateWeekdays.mutate({ companyId, weekdays });
      }}
      onAddHoliday={(values) => {
        if (companyId === null) {
          return;
        }
        addHoliday.mutate({
          companyId,
          date: values.date,
          label: values.label,
        });
      }}
      onRemoveHoliday={(holidayId) => {
        if (companyId === null) {
          return;
        }
        removeHoliday.mutate({ companyId, holidayId });
      }}
    />
  );
}
