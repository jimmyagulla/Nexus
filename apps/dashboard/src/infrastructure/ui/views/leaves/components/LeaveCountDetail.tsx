import { i18n } from '../../../i18n/i18n';
import { LeaveCountDetailRow } from './LeaveCountDetailRow';
import type { LeaveCountDetailModel } from '../../../../../adapters/presenters/leaves/leave-request.presenter';

/** "Détail du décompte": how the working days of the request are counted. */
export function LeaveCountDetail({
  range,
  calendarDays,
  weekendsExcluded,
  holidaysExcluded,
  countedDays,
  expectedReturn,
}: LeaveCountDetailModel) {
  const labels = i18n.messages.leaves.request;

  return (
    <div className="flex flex-col rounded-lg border border-border text-13">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="whitespace-nowrap font-bold text-heading">
          {labels.detailTitle}
        </span>
        <span className="whitespace-nowrap text-muted-foreground">{range}</span>
      </div>
      <LeaveCountDetailRow label={labels.calendarDays} value={calendarDays} />
      <LeaveCountDetailRow label={labels.weekendsExcluded} value={weekendsExcluded} />
      <LeaveCountDetailRow label={labels.holidaysExcluded} value={holidaysExcluded} />
      <LeaveCountDetailRow label={labels.countedDays} value={countedDays} variant="total" />
      <LeaveCountDetailRow
        label={labels.expectedReturn}
        value={expectedReturn}
        variant="footer"
      />
    </div>
  );
}
