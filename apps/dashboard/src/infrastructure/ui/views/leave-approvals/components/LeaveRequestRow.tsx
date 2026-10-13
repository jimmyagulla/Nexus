import { i18n } from '../../../i18n/i18n';
import { Avatar, AvatarFallback } from '../../../shared/avatar';
import { Badge } from '../../../shared/badge';
import { Button } from '../../../shared/button';
import { TableCell, TableRow } from '../../../shared/table';
import type { LeaveRequestRowModel } from '../../../../../adapters/presenters/leave-approvals/leave-approvals.view-models';

/** Pending leave request with its Refuser / Accepter decision. */
export function LeaveRequestRow({ request }: { request: LeaveRequestRowModel }) {
  const labels = i18n.messages.leaveApprovals;

  return (
    <TableRow className="py-2.5 last:border-b">
      <TableCell className="flex items-center gap-2.5">
        <Avatar>
          <AvatarFallback>{request.initials}</AvatarFallback>
        </Avatar>
        <span className="font-semibold">{request.employee}</span>
      </TableCell>
      <TableCell className="text-body">{request.type}</TableCell>
      <TableCell className="text-muted-foreground">{request.period}</TableCell>
      <TableCell className="text-right font-bold">{request.days}</TableCell>
      <TableCell className="text-right text-muted-foreground">
        {request.balanceAfter}
      </TableCell>
      <TableCell>
        <Badge tone={request.status.tone}>{request.status.label}</Badge>
      </TableCell>
      <TableCell className="flex justify-end gap-2">
        <Button variant="outline-destructive" size="xs" className="px-2.5">
          {labels.refuse}
        </Button>
        <Button size="xs" className="gap-1.5">
          <i aria-hidden className="ri-check-line" />
          {labels.accept}
        </Button>
      </TableCell>
    </TableRow>
  );
}
