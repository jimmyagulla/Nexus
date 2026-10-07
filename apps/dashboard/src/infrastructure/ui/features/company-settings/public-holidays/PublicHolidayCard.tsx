import type { PublicHolidayViewModel } from '../../../../../adapters/presenters/company-settings.presenter';
import { Button } from '../../../shared/button';
import { i18n } from '../../../i18n/i18n';

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
        {i18n.messages.settings.removeHoliday}
      </Button>
    </li>
  );
}
