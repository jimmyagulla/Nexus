import { FormEvent } from 'react';
import { CompanySettingsDto } from '@hexagonal-monorepo-template/ports';
import { Button } from '../shared/button';
import { Card } from '../shared/card';
import { Input } from '../shared/input';
import { Label } from '../shared/label';

export type SettingsViewProps = {
  settings: CompanySettingsDto | null;
  weekdays: { value: number; label: string }[];
  name: string;
  holidayDate: string;
  holidayLabel: string;
  onNameChange: (value: string) => void;
  onHolidayDateChange: (value: string) => void;
  onHolidayLabelChange: (value: string) => void;
  onCreate: (event: FormEvent) => void;
  onRename: (event: FormEvent) => void;
  onToggleWeekday: (weekday: number) => void;
  onAddHoliday: (event: FormEvent) => void;
  onRemoveHoliday: (holidayId: string) => void;
};

export function SettingsView({
  settings,
  weekdays,
  name,
  holidayDate,
  holidayLabel,
  onNameChange,
  onHolidayDateChange,
  onHolidayLabelChange,
  onCreate,
  onRename,
  onToggleWeekday,
  onAddHoliday,
  onRemoveHoliday,
}: SettingsViewProps) {
  if (settings === null) {
    return (
      <Card className="p-6 max-w-lg space-y-4">
        <h1 className="text-2xl font-semibold">Paramètres</h1>
        <p>Créez votre entreprise pour ouvrir le périmètre.</p>
        <form onSubmit={onCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nom de l&apos;entreprise</Label>
            <Input
              id="company-name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
            />
          </div>
          <Button type="submit">Créer l&apos;entreprise</Button>
        </form>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Paramètres</h1>
      <Card className="p-6 space-y-4 max-w-2xl">
        <h2 className="text-lg font-medium">Entreprise</h2>
        <form onSubmit={onRename} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="settings-name">Nom</Label>
            <Input
              id="settings-name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
            />
          </div>
          <Button type="submit">Enregistrer le nom</Button>
        </form>
      </Card>
      <Card className="p-6 space-y-4 max-w-2xl">
        <h2 className="text-lg font-medium">Jours habituels non travaillés</h2>
        <div className="flex flex-wrap gap-2">
          {weekdays.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={
                settings.nonWorkingWeekdays.includes(option.value)
                  ? 'default'
                  : 'outline'
              }
              onClick={() => onToggleWeekday(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </Card>
      <Card className="p-6 space-y-4 max-w-2xl">
        <h2 className="text-lg font-medium">Jours fériés</h2>
        <ul className="space-y-2">
          {settings.holidays.map((holiday) => (
            <li key={holiday.id} className="flex items-center justify-between gap-4">
              <span>
                {holiday.date} — {holiday.label}
              </span>
              <Button
                type="button"
                variant="outline"
                onClick={() => onRemoveHoliday(holiday.id)}
              >
                Retirer
              </Button>
            </li>
          ))}
        </ul>
        <form onSubmit={onAddHoliday} className="grid gap-4 md:grid-cols-3">
          <Input
            type="date"
            value={holidayDate}
            onChange={(event) => onHolidayDateChange(event.target.value)}
            required
          />
          <Input
            placeholder="Libellé"
            value={holidayLabel}
            onChange={(event) => onHolidayLabelChange(event.target.value)}
            required
          />
          <Button type="submit">Ajouter</Button>
        </form>
      </Card>
    </div>
  );
}
