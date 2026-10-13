import type { PresenceRowViewModel } from '../../../../../adapters/presenters/presence.presenter';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import type { AdjustWorkedDaysValues } from '../adjust-worked-days/adjust-worked-days.schema';
import { i18n } from '../../../i18n/i18n';
import { PresenceCard } from './PresenceCard';

interface PresenceListProps {
  presences: PresenceRowViewModel[];
  canManage: boolean;
  errorPresenter: ErrorPresenter;
  adjustError: string | null;
  onAdjust: (
    presenceId: string,
    values: AdjustWorkedDaysValues,
  ) => Promise<boolean>;
}

export function PresenceList({
  presences,
  canManage,
  errorPresenter,
  adjustError,
  onAdjust,
}: PresenceListProps) {
  if (presences.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {i18n.messages.presences.noPresence}
      </p>
    );
  }

  return (
    <ul>
      {presences.map((presence) => (
        <PresenceCard
          key={presence.id}
          presence={presence}
          canManage={canManage}
          errorPresenter={errorPresenter}
          adjustError={adjustError}
          onAdjust={onAdjust}
        />
      ))}
    </ul>
  );
}
