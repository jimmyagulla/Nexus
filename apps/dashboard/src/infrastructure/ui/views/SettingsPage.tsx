import { FormEvent, useEffect, useState } from 'react';
import {
  addHoliday,
  createCompany,
  fetchCompanySettings,
  removeHoliday,
  updateCompanyName,
  updateNonWorkingWeekdays,
  type CompanySettings,
} from '../../../adapters/gateways/company-api.gateway';
import {
  getCompanyId,
  setCompanyId,
} from '../stores/company-session.store';
import { Button } from '../shared/button';
import { Input } from '../shared/input';
import { Label } from '../shared/label';
import { Card } from '../shared/card';
import { useToast } from '../hooks/use-toast';

const WEEKDAY_OPTIONS = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' },
];

export function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [name, setName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayLabel, setHolidayLabel] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const companyId = getCompanyId();
    if (companyId === null) {
      setLoading(false);
      return;
    }
    fetchCompanySettings(companyId)
      .then((loaded) => {
        setSettings(loaded);
        setName(loaded.name);
      })
      .catch((error: Error) => {
        toast({ title: error.message, variant: 'destructive' });
      })
      .finally(() => setLoading(false));
  }, [toast]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    try {
      const created = await createCompany(name);
      setCompanyId(created.id);
      setSettings(created);
      toast({ title: 'Entreprise créée.' });
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : 'Erreur',
        variant: 'destructive',
      });
    }
  }

  async function handleSaveName(event: FormEvent) {
    event.preventDefault();
    if (settings === null) {
      return;
    }
    try {
      const updated = await updateCompanyName(settings.id, name);
      setSettings(updated);
      toast({ title: 'Nom enregistré.' });
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : 'Erreur',
        variant: 'destructive',
      });
    }
  }

  async function toggleWeekday(weekday: number) {
    if (settings === null) {
      return;
    }
    const selected = new Set(settings.nonWorkingWeekdays);
    if (selected.has(weekday)) {
      selected.delete(weekday);
    } else {
      selected.add(weekday);
    }
    if (selected.size === 0) {
      toast({
        title: 'Renseignez les informations obligatoires.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const updated = await updateNonWorkingWeekdays(
        settings.id,
        [...selected].sort((a, b) => a - b),
      );
      setSettings(updated);
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : 'Erreur',
        variant: 'destructive',
      });
    }
  }

  async function handleAddHoliday(event: FormEvent) {
    event.preventDefault();
    if (settings === null) {
      return;
    }
    try {
      const updated = await addHoliday(
        settings.id,
        holidayDate,
        holidayLabel,
      );
      setSettings(updated);
      setHolidayDate('');
      setHolidayLabel('');
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : 'Erreur',
        variant: 'destructive',
      });
    }
  }

  if (loading) {
    return <p>Chargement…</p>;
  }

  if (settings === null) {
    return (
      <Card className="p-6 max-w-lg space-y-4">
        <h1 className="text-2xl font-semibold">Paramètres</h1>
        <p>Créez votre entreprise pour ouvrir le périmètre.</p>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nom de l&apos;entreprise</Label>
            <Input
              id="company-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
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
        <form onSubmit={handleSaveName} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="settings-name">Nom</Label>
            <Input
              id="settings-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <Button type="submit">Enregistrer le nom</Button>
        </form>
      </Card>

      <Card className="p-6 space-y-4 max-w-2xl">
        <h2 className="text-lg font-medium">Jours habituels non travaillés</h2>
        <div className="flex flex-wrap gap-2">
          {WEEKDAY_OPTIONS.map((option) => {
            const active = settings.nonWorkingWeekdays.includes(option.value);
            return (
              <Button
                key={option.value}
                type="button"
                variant={active ? 'default' : 'outline'}
                onClick={() => toggleWeekday(option.value)}
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 space-y-4 max-w-2xl">
        <h2 className="text-lg font-medium">Jours fériés</h2>
        <ul className="space-y-2">
          {settings.holidays.map((holiday) => (
            <li
              key={holiday.id}
              className="flex items-center justify-between gap-4"
            >
              <span>
                {holiday.date} — {holiday.label}
              </span>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  removeHoliday(settings.id, holiday.id)
                    .then(setSettings)
                    .catch((error: Error) =>
                      toast({ title: error.message, variant: 'destructive' }),
                    )
                }
              >
                Retirer
              </Button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddHoliday} className="grid gap-4 md:grid-cols-3">
          <Input
            type="date"
            value={holidayDate}
            onChange={(event) => setHolidayDate(event.target.value)}
            required
          />
          <Input
            placeholder="Libellé"
            value={holidayLabel}
            onChange={(event) => setHolidayLabel(event.target.value)}
            required
          />
          <Button type="submit">Ajouter</Button>
        </form>
      </Card>
    </div>
  );
}
