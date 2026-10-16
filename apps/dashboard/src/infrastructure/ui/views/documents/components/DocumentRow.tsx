import { useState } from 'react';
import { Badge } from '../../../shared/badge';
import { TableCell, TableRow } from '../../../shared/table';
import { DocumentActionsMenu } from './DocumentActionsMenu';
import type { DocumentRowModel } from '../../../../../adapters/presenters/documents/documents.presenter';

interface DocumentRowProps {
  model: DocumentRowModel;
  onView: (documentId: string) => void;
  onDownload: (documentId: string) => void;
}

/** A document of the list. A right click opens the same actions as "…". */
export function DocumentRow({ model, onView, onDownload }: DocumentRowProps) {
  const [actionsOpen, setActionsOpen] = useState(false);

  return (
    <TableRow
      className="last:border-b"
      onContextMenu={(event) => {
        event.preventDefault();
        setActionsOpen(true);
      }}
    >
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
        <DocumentActionsMenu
          open={actionsOpen}
          onOpenChange={setActionsOpen}
          onView={() => onView(model.id)}
          onDownload={() => onDownload(model.id)}
        />
      </TableCell>
    </TableRow>
  );
}
