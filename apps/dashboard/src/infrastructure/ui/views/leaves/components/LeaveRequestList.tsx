import { FilterButton } from '../../../common/data/FilterButton';
import { i18n } from '../../../i18n/i18n';
import { Card } from '../../../shared/card';
import { LeaveRequestItem, type LeaveRequestItemModel } from './LeaveRequestItem';

interface LeaveRequestListProps {
  requests: LeaveRequestItemModel[];
}

/** "Mes demandes" card: header with the filters toggle, one row per request. */
export function LeaveRequestList({ requests }: LeaveRequestListProps) {
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-16 font-bold text-heading">
          {i18n.messages.leaves.list.myRequests}
        </h2>
        <FilterButton className="h-8 gap-1.5 border-primary px-2.5 text-13 [&_i]:text-13" />
      </div>
      <ul>
        {requests.map((request) => (
          <LeaveRequestItem key={`${request.type}-${request.period}`} {...request} />
        ))}
      </ul>
    </Card>
  );
}
