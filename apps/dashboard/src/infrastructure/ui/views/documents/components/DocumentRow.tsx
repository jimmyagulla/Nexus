import { RowAction } from '../../../common/data/RowAction';
import { i18n } from '../../../i18n/i18n';
import { Badge, type BadgeProps } from '../../../shared/badge';
import { TableCell, TableRow } from '../../../shared/table';

export interface DocumentRowModel {
  id: string;
  /** Remix Icon class of the document kind, e.g. `ri-file-text-line`. */
  icon: string;
  name: string;
  category: string;
  date: string;
  format: string;
  size: string;
  emitter: string;
  status: { label: string; tone: BadgeProps['tone'] };
}

interface DocumentRowProps {
  model: DocumentRowModel;
}

export function DocumentRow({ model }: DocumentRowProps) {
  const common = i18n.messages.common;

  return (
    <TableRow className="last:border-b">
      <TableCell className="flex items-center gap-2.5">
        <i aria-hidden className={`${model.icon} shrink-0 text-20 text-primary`} />
        <span className="font-semibold text-foreground">
          <span>{model.name}</span>
        </span>
      </TableCell>
      <TableCell className="text-muted-foreground">
        <span>{model.category}</span>
      </TableCell>
      <TableCell className="text-muted-foreground">
        <span>{model.date}</span>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {`${model.format} · `}
        <span>{model.size}</span>
      </TableCell>
      <TableCell className="text-muted-foreground">
        <span>{model.emitter}</span>
      </TableCell>
      <TableCell>
        <Badge tone={model.status.tone}>
          <span>{model.status.label}</span>
        </Badge>
      </TableCell>
      <TableCell className="flex justify-end gap-0.5 text-18 text-primary">
        <RowAction label={common.view} icon={<i aria-hidden className="ri-eye-line" />} />
        <RowAction
          label={common.download}
          icon={<i aria-hidden className="ri-download-2-line" />}
        />
        <RowAction label={common.more} icon={<i aria-hidden className="ri-more-2-fill" />} />
      </TableCell>
    </TableRow>
  );
}
