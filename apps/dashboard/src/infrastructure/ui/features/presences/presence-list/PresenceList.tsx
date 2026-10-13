import type { PresenceRowViewModel } from '../../../../../adapters/presenters/presence.presenter';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import type { AdjustWorkedDaysValues } from '../adjust-worked-days/adjust-worked-days.schema';
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
