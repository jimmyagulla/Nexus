import type { PresenceListViewModel } from '../../../adapters/presenters/presence.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import type { AdjustWorkedDaysValues } from '../features/presences/adjust-worked-days/adjust-worked-days.schema';
import { OpenPresenceDialog } from '../features/presences/open-presence/OpenPresenceDialog';
import type { OpenPresenceValues } from '../features/presences/open-presence/open-presence.schema';
import { PresenceList } from '../features/presences/presence-list/PresenceList';
import { i18n } from '../i18n/i18n';

interface PresencesProps {
  model: PresenceListViewModel;
  errorPresenter: ErrorPresenter;
  openError: string | null;
  adjustError: string | null;
  onOpen: (values: OpenPresenceValues) => Promise<boolean>;
  onAdjust: (
    presenceId: string,
    values: AdjustWorkedDaysValues,
  ) => Promise<boolean>;
}

export function Presences({
  model,
  errorPresenter,
  openError,
  adjustError,
  onOpen,
  onAdjust,
}: PresencesProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">{i18n.messages.presences.title}</h1>

      {model.canManage ? (
        <OpenPresenceDialog
          employees={model.employees}
          errorPresenter={errorPresenter}
          submissionError={openError}
          onSubmit={onOpen}
        />
      ) : null}

      <PresenceList
        presences={model.rows}
        canManage={model.canManage}
        errorPresenter={errorPresenter}
        adjustError={adjustError}
        onAdjust={onAdjust}
      />
    </div>
  );
}
