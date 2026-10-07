import type { PublicHolidayViewModel } from '../../../../../adapters/presenters/company-settings.presenter';
import { i18n } from '../../../i18n/i18n';
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
        {i18n.messages.settings.noPublicHolidays}
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
