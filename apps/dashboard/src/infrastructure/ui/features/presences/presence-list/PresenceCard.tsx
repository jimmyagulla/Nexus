import type { PresenceRowViewModel } from '../../../../../adapters/presenters/presence.presenter';
import { i18n } from '../../../i18n/i18n';

interface PresenceCardProps {
  presence: PresenceRowViewModel;
}

export function PresenceCard({ presence }: PresenceCardProps) {
  return (
    <li className="flex flex-wrap items-center gap-4 py-2">
      <span className="font-medium">{presence.employeeName}</span>
      <span>{presence.monthLabel}</span>
      <span className="text-sm text-muted-foreground">
        {`${i18n.messages.presences.workedDays} : ${presence.workedDays}`}
      </span>
    </li>
  );
}
