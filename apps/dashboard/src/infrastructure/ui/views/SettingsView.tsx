import { CompanySettingsViewModel } from '../../../adapters/presenters/company-settings/company-settings.presenter';
import { CompanyNameForm } from '../features/company-settings/CompanyNameForm';
import { HolidayForm } from '../features/company-settings/HolidayForm';
import { NonWorkingWeekdaysForm } from '../features/company-settings/NonWorkingWeekdaysForm';
import { CompanyNameValues } from '../features/company-settings/company-name.schema';
import { HolidayValues } from '../features/company-settings/holiday.schema';
import { Button } from '../shared/button';
import { Card } from '../shared/card';
import { AuditHistory } from './AuditHistory';

export type SettingsViewProps = {
  settings: CompanySettingsViewModel | null;
  auditLines: string[];
  onCreate: (values: CompanyNameValues) => void;
  onRename: (values: CompanyNameValues) => void;
  onWeekdaysChange: (weekdays: number[]) => void;
  onAddHoliday: (values: HolidayValues) => void;
  onRemoveHoliday: (holidayId: string) => void;
};

export function SettingsView({
  settings,
  auditLines,
  onCreate,
  onRename,
  onWeekdaysChange,
  onAddHoliday,
  onRemoveHoliday,
}: SettingsViewProps) {
  if (settings === null) {
    return (
      <Card className="p-6 max-w-lg space-y-4">
        <h1 className="text-2xl font-semibold">Paramètres</h1>
        <p>Créez votre entreprise pour ouvrir le périmètre.</p>
        <CompanyNameForm
          defaultName=""
          submitLabel="Créer l'entreprise"
          onSubmit={onCreate}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Paramètres</h1>
      <Card className="p-6 space-y-4 max-w-2xl">
        <h2 className="text-lg font-medium">Entreprise</h2>
        <CompanyNameForm
          defaultName={settings.name}
          submitLabel="Enregistrer le nom"
          onSubmit={onRename}
        />
      </Card>
      <Card className="p-6 space-y-4 max-w-2xl">
        <h2 className="text-lg font-medium">Jours habituels non travaillés</h2>
        <NonWorkingWeekdaysForm
          weekdays={settings.weekdays}
          onChange={onWeekdaysChange}
        />
      </Card>
      <Card className="p-6 space-y-4 max-w-2xl">
        <h2 className="text-lg font-medium">Jours fériés</h2>
        <ul className="space-y-2">
          {settings.holidays.map((holiday) => (
            <li key={holiday.id} className="flex items-center justify-between gap-4">
              <span>{holiday.caption}</span>
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
        <HolidayForm onSubmit={onAddHoliday} />
      </Card>
      {auditLines.length > 0 ? (
        <Card className="p-6 space-y-4 max-w-2xl">
          <AuditHistory lines={auditLines} />
        </Card>
      ) : null}
    </div>
  );
}
