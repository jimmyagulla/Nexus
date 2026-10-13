import { Badge } from '../../../shared/badge';
import type { LeaveRequestItemModel } from '../../../../../adapters/presenters/leaves/leaves.view-models';

/** One row of "Mes demandes": type and period, days, status. */
export function LeaveRequestItem({ type, period, days, status }: LeaveRequestItemModel) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_44px_120px] items-center gap-3 border-b border-border px-5 py-2.75 text-14">
      <span className="flex flex-col">
        <span className="font-semibold text-foreground">{type}</span>
        <span className="text-12 text-subtle">{period}</span>
      </span>
      <span className="text-right font-semibold">{days}</span>
      <span className="text-right">
        <Badge tone={status.tone}>{status.label}</Badge>
      </span>
    </li>
  );
}
