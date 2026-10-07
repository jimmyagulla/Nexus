import type { PublicHolidayViewModel } from '../../../../adapters/presenters/company-settings.presenter';
import { Button } from '../../shared/button';
import { fr } from '../../i18n/fr';

interface PublicHolidayCardProps {
  publicHoliday: PublicHolidayViewModel;
  onRemove: (publicHolidayId: string) => void;
}

export function PublicHolidayCard({
  publicHoliday,
  onRemove,
}: PublicHolidayCardProps) {
  return (
    <li className="flex items-center gap-4 py-2">
      <span>
        {publicHoliday.date} — {publicHoliday.label}
      </span>
      <Button
        type="button"
        variant="outline"
        onClick={() => onRemove(publicHoliday.id)}
      >
        {fr.settings.removeHoliday}
      </Button>
    </li>
  );
}
