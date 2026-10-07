import type { PublicHolidayViewModel } from '../../../../adapters/presenters/company-settings.presenter';
import { fr } from '../../i18n/fr';
import { PublicHolidayCard } from './PublicHolidayCard';

interface PublicHolidayListProps {
  publicHolidays: PublicHolidayViewModel[];
  onRemove: (publicHolidayId: string) => void;
}

export function PublicHolidayList({
  publicHolidays,
  onRemove,
}: PublicHolidayListProps) {
  if (publicHolidays.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {fr.settings.noPublicHolidays}
      </p>
    );
  }

  return (
    <ul>
      {publicHolidays.map((publicHoliday) => (
        <PublicHolidayCard
          key={publicHoliday.id}
          publicHoliday={publicHoliday}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}
