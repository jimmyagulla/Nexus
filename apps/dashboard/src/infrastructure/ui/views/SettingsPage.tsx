import { FormEvent, useState } from 'react';
import { CompanySettingsController } from '../../../adapters/controllers/company-settings/company-settings.controller';
import { useCreateCompany } from '../hooks/useCreateCompany';
import { useGetCompanySettings } from '../hooks/useGetCompanySettings';
import { getCompanyId } from '../stores/company-session.store';
import { SettingsView } from './SettingsView';

const WEEKDAYS = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' },
];

export function SettingsPage({
  controller,
}: {
  controller: CompanySettingsController;
}) {
  const [companyId, setCurrentId] = useState(getCompanyId());
  const [name, setName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayLabel, setHolidayLabel] = useState('');
  const settingsQuery = useGetCompanySettings(companyId, controller);
  const createCompany = useCreateCompany(controller);

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    const created = await createCompany.mutateAsync(name);
    setCurrentId(created.id);
    setName(created.name);
  }

  async function onRename(event: FormEvent) {
    event.preventDefault();
    if (companyId === null) return;
    await controller.rename(companyId, name);
    await settingsQuery.refetch();
  }

  async function onToggleWeekday(weekday: number) {
    const current = settingsQuery.data;
    if (current === undefined || companyId === null) return;
    const selected = new Set(current.nonWorkingWeekdays);
    if (selected.has(weekday)) selected.delete(weekday);
    else selected.add(weekday);
    await controller.setWeekdays(companyId, [...selected].sort((a, b) => a - b));
    await settingsQuery.refetch();
  }

  async function onAddHoliday(event: FormEvent) {
    event.preventDefault();
    if (companyId === null) return;
    await controller.addPublicHoliday(companyId, holidayDate, holidayLabel);
    setHolidayDate('');
    setHolidayLabel('');
    await settingsQuery.refetch();
  }

  async function onRemoveHoliday(holidayId: string) {
    if (companyId === null) return;
    await controller.removePublicHoliday(companyId, holidayId);
    await settingsQuery.refetch();
  }

  if (companyId !== null && settingsQuery.isLoading) {
    return <p>Chargement…</p>;
  }

  if (settingsQuery.isError) {
    return <p>{settingsQuery.error.message}</p>;
  }

  return (
    <SettingsView
      settings={settingsQuery.data ?? null}
      weekdays={WEEKDAYS}
      name={name || settingsQuery.data?.name || ''}
      holidayDate={holidayDate}
      holidayLabel={holidayLabel}
      onNameChange={setName}
      onHolidayDateChange={setHolidayDate}
      onHolidayLabelChange={setHolidayLabel}
      onCreate={onCreate}
      onRename={onRename}
      onToggleWeekday={onToggleWeekday}
      onAddHoliday={onAddHoliday}
      onRemoveHoliday={onRemoveHoliday}
    />
  );
}
