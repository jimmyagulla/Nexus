import { IconTile } from '../../../common/data/IconTile';
import { Badge } from '../../../shared/badge';
import { TableCell, TableRow } from '../../../shared/table';
import type { ProfessionalExpenseRowModel } from '../../../../../adapters/presenters/professional-expenses/professional-expenses.presenter';

export function ProfessionalExpenseRow({
  request,
}: {
  request: ProfessionalExpenseRowModel;
}) {
  return (
    <TableRow className="gap-4 border-b px-5 last:border-b">
      <TableCell className="flex items-center gap-3 font-semibold text-foreground">
        <IconTile tone="orange" size={32} className="text-16">
          <i aria-hidden className={request.icon} />
        </IconTile>
        <span>{request.type}</span>
      </TableCell>
      <TableCell className="text-muted-foreground">{request.period}</TableCell>
      <TableCell className="text-muted-foreground">{request.detail}</TableCell>
      <TableCell className="text-right font-bold">{request.amount}</TableCell>
      <TableCell>
        <Badge tone={request.status.tone}>{request.status.label}</Badge>
      </TableCell>
      <i aria-hidden className="ri-arrow-right-s-line text-18 text-disabled" />
    </TableRow>
  );
}
