import type { PresenceRowViewModel } from '../../../../../adapters/presenters/presence.presenter';
import { i18n } from '../../../i18n/i18n';
import { PresenceRubric } from './PresenceRubric';

interface PresenceCardProps {
  presence: PresenceRowViewModel;
}

export function PresenceCard({ presence }: PresenceCardProps) {
  return (
    <li className="space-y-2 py-4">
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-medium">{presence.employeeName}</span>
        <span>{presence.monthLabel}</span>
        <span className="text-sm text-muted-foreground">
          {`${i18n.messages.presences.workedDays} : ${presence.workedDays}`}
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PresenceRubric
          label={i18n.messages.presences.leaves}
          entries={presence.leaves}
        />
        <PresenceRubric
          label={i18n.messages.presences.absences}
          entries={presence.absences}
        />
        <PresenceRubric
          label={i18n.messages.presences.sickLeaves}
          entries={presence.sickLeaves}
        />
        <PresenceRubric
          label={i18n.messages.presences.overtime}
          entries={presence.overtime}
        />
      </div>
    </li>
  );
}
