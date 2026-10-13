import { FilterButton } from '../../common/data/FilterButton';
import { FilterChip } from '../../common/data/FilterChip';
import { SearchField } from '../../common/data/SearchField';
import { SortButton } from '../../common/data/SortButton';
import { InfoNote } from '../../common/feedback/InfoNote';
import { PageContent } from '../../common/page/PageContent';
import { i18n } from '../../i18n/i18n';
import { Button } from '../../shared/button';
import { Table, TableHead, TableHeader } from '../../shared/table';
import { LeaveRequestRow } from './components/LeaveRequestRow';
import type { LeaveApprovalsViewModel } from '../../../../adapters/presenters/leave-approvals/leave-approvals.presenter';

const columns = 'minmax(0, 1.2fr) 120px 170px 60px 100px 110px 190px';

/** P9.1 — leave requests waiting for the employer's decision. */
export function LeaveApprovals({ model }: { model: LeaveApprovalsViewModel }) {
  const labels = i18n.messages.leaveApprovals;

  return (
    <PageContent className="md:px-8 md:py-7">
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-28 leading-9 font-bold text-heading">
            {labels.title}
          </h1>
          <span className="text-14 text-muted-foreground">{model.summary}</span>
        </div>
        <Button variant="outline">
          <i aria-hidden className="ri-calendar-2-line" />
          {labels.teamPlanning}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <SearchField placeholder={labels.searchPlaceholder} />
        <FilterButton count={1} className="border border-primary bg-card" />
        <FilterChip label={labels.statusFilter} value={model.statusFilter} />
        <span className="flex-1" />
        <SortButton label={labels.sort} />
      </div>

      <Table columns={columns}>
        <TableHeader>
          <TableHead>{labels.employee}</TableHead>
          <TableHead>{labels.type}</TableHead>
          <TableHead>{labels.period}</TableHead>
          <TableHead className="justify-end">{labels.days}</TableHead>
          <TableHead className="justify-end">{labels.balanceAfter}</TableHead>
          <TableHead>{labels.status}</TableHead>
          <TableHead className="justify-end">{labels.decision}</TableHead>
        </TableHeader>
        {model.requests.map((request) => (
          <LeaveRequestRow key={request.id} request={request} />
        ))}
      </Table>

      <InfoNote
        className="items-center border border-border bg-card px-3.5 py-3"
        icon={
          <i
            aria-hidden
            className="ri-information-line text-18 text-muted-foreground"
          />
        }
      >
        {labels.footnote}
      </InfoNote>
    </PageContent>
  );
}
