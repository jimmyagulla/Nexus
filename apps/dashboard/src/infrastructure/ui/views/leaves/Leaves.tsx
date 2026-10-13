import { Link } from '@tanstack/react-router';
import { PageContent } from '../../common/page/PageContent';
import { PageHeader } from '../../common/page/PageHeader';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Button } from '../../shared/button';
import { LeaveBalanceHighlight } from './components/LeaveBalanceHighlight';
import { LeaveCalendar, type LeaveCalendarModel } from './components/LeaveCalendar';
import { LeaveCounter } from './components/LeaveCounter';
import { LeaveRequestList } from './components/LeaveRequestList';
import type { LeaveRequestItemModel } from './components/LeaveRequestItem';

export interface LeavesViewModel {
  /** "01/06/2026 – 31/05/2027" */
  referencePeriod: string;
  balance: {
    available: string;
    acquired: string;
    taken: string;
    pending: string;
  };
  calendar: LeaveCalendarModel;
  requests: LeaveRequestItemModel[];
}

interface LeavesProps {
  model: LeavesViewModel;
}

/** P4.1 — leave balance, month calendar and the employee's requests. */
export function Leaves({ model }: LeavesProps) {
  const labels = i18n.messages.leaves.list;

  return (
    <PageContent className="gap-5 md:py-7">
      <PageHeader
        className="*:gap-1"
        title={labels.title}
        description={`${labels.referencePeriod} ${model.referencePeriod}`}
        actions={
          <Button asChild className="shadow-focus">
            <Link to={AppRoutes.leaveRequest}>
              <i aria-hidden className="ri-add-line text-18" />
              {labels.newRequest}
            </Link>
          </Button>
        }
      />
      <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr] gap-3.5">
        <LeaveBalanceHighlight label={labels.available} value={model.balance.available} />
        <LeaveCounter label={labels.acquired} value={model.balance.acquired} />
        <LeaveCounter label={labels.taken} value={model.balance.taken} />
        <LeaveCounter label={labels.pending} value={model.balance.pending} tone="pending" />
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-start gap-5">
        <LeaveCalendar {...model.calendar} />
        <LeaveRequestList requests={model.requests} />
      </div>
    </PageContent>
  );
}
