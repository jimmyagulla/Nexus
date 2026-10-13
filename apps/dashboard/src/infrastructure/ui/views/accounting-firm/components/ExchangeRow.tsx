import { RowAction } from '../../../common/data/RowAction';
import { i18n } from '../../../i18n/i18n';
import { Badge } from '../../../shared/badge';
import { TableCell, TableRow } from '../../../shared/table';
import type { ExchangeRowModel } from '../../../../../adapters/presenters/accounting-firm/accounting-firm.view-models';

/** Document exchanged with the accounting firm, with its direction. */
export function ExchangeRow({ exchange }: { exchange: ExchangeRowModel }) {
  const labels = i18n.messages.accountingFirm.exchanges;
  const toFirm = exchange.direction === 'toFirm';

  return (
    <TableRow className="py-1.75 last:border-b">
      <TableCell className="flex items-center gap-2.5">
        <i
          aria-hidden
          className={`${exchange.icon} shrink-0 text-20 text-foreground`}
        />
        <span className="flex flex-col">
          <span className="font-semibold text-foreground">{exchange.name}</span>
          <span className="text-12 text-subtle">{exchange.category}</span>
        </span>
      </TableCell>
      <TableCell className="text-muted-foreground">{exchange.date}</TableCell>
      <TableCell>
        <Badge
          tone={toFirm ? 'dark' : 'neutral'}
          className={`gap-1.5 rounded-md px-2 font-bold ${toFirm ? '' : 'text-foreground'}`}
        >
          <i
            aria-hidden
            className={`${toFirm ? 'ri-arrow-right-up-line' : 'ri-arrow-left-down-line'} text-14`}
          />
          <span>{toFirm ? labels.toFirm : labels.fromFirm}</span>
        </Badge>
      </TableCell>
      <TableCell>
        <Badge tone={exchange.status.tone}>{exchange.status.label}</Badge>
      </TableCell>
      <TableCell className="flex justify-end text-18 text-primary">
        <RowAction
          label={i18n.messages.common.view}
          icon={<i aria-hidden className="ri-eye-line text-18" />}
        />
        <RowAction
          label={i18n.messages.common.more}
          icon={<i aria-hidden className="ri-more-2-fill text-18" />}
        />
      </TableCell>
    </TableRow>
  );
}
