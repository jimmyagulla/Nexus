import { Badge } from '../../../shared/badge';
import { TableCell, TableRow } from '../../../shared/table';
import type { OvertimeDeclarationRowModel } from '../../../../../adapters/presenters/overtime/overtime.presenter';

export function OvertimeDeclarationRow({
  date,
  hours,
  reason,
  proof,
  status,
}: OvertimeDeclarationRowModel) {
  return (
    <TableRow className="gap-4 px-5 py-2.5 last:border-b">
      <TableCell className="text-muted-foreground">{date}</TableCell>
      <TableCell className="text-right font-bold text-heading">{hours}</TableCell>
      <TableCell className="text-foreground">{reason}</TableCell>
      <TableCell className="text-13 text-muted-foreground">{proof}</TableCell>
      <TableCell>
        <Badge tone={status.tone}>{status.label}</Badge>
      </TableCell>
      <i aria-hidden className="ri-arrow-right-s-line text-18 text-disabled" />
    </TableRow>
  );
}
