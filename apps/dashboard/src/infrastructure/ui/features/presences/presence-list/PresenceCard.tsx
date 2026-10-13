import type { PresenceRowViewModel } from '../../../../../adapters/presenters/presence.presenter';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { AdjustWorkedDaysDialog } from '../adjust-worked-days/AdjustWorkedDaysDialog';
import type { AdjustWorkedDaysValues } from '../adjust-worked-days/adjust-worked-days.schema';
import { i18n } from '../../../i18n/i18n';
import { PresenceRubric } from './PresenceRubric';
import { WorkedDaysHistory } from './WorkedDaysHistory';

interface PresenceCardProps {
  presence: PresenceRowViewModel;
  canManage: boolean;
  errorPresenter: ErrorPresenter;
  adjustError: string | null;
  onAdjust: (
    presenceId: string,
    values: AdjustWorkedDaysValues,
  ) => Promise<boolean>;
}

export function PresenceCard({
  presence,
  canManage,
  errorPresenter,
  adjustError,
  onAdjust,
}: PresenceCardProps) {
  return (
    <li className="space-y-2 py-4">
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-medium">{presence.employeeName}</span>
        <span>{presence.monthLabel}</span>
        <span className="text-sm text-muted-foreground">
          {`${i18n.messages.presences.workedDays} : ${presence.workedDays}`}
        </span>
        {canManage ? (
          <AdjustWorkedDaysDialog
            workedDays={presence.workedDays}
            errorPresenter={errorPresenter}
            submissionError={adjustError}
            onSubmit={(values) => onAdjust(presence.id, values)}
          />
        ) : null}
      </div>
      <WorkedDaysHistory
        originalWorkedDays={presence.originalWorkedDays}
        history={presence.history}
      />
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
