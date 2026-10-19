import { useState } from 'react';
import { FileActionsMenu } from '../../../common/data/FileActionsMenu';
import { FileContextMenu } from '../../../common/data/FileContextMenu';
import { Badge } from '../../../shared/badge';
import { TableCell, TableRow } from '../../../shared/table';
import type { DocumentRowModel } from '../../../../../adapters/presenters/documents/document-row.presenter';

interface DocumentRowProps {
  model: DocumentRowModel;
  onView: (documentId: string) => void;
  onDownload: (documentId: string) => void;
}

/** A document of the list. Its name opens it; a right click opens its actions under the cursor. */
export function DocumentRow({ model, onView, onDownload }: DocumentRowProps) {
  const [contextPoint, setContextPoint] = useState<{ x: number; y: number } | null>(null);
  const view = () => onView(model.id);
  const download = () => onDownload(model.id);

  return (
    <TableRow
      className="last:border-b"
      onContextMenu={(event) => {
        event.preventDefault();
        setContextPoint({ x: event.clientX, y: event.clientY });
      }}
    >
      <TableCell className="flex items-center gap-2.5">
        <i aria-hidden className={`${model.icon} shrink-0 text-20 text-primary`} />
        <button
          type="button"
          onClick={view}
          className="min-w-0 truncate text-left font-semibold text-foreground hover:text-link hover:underline focus-visible:outline-none focus-visible:shadow-focus"
        >
          <span>{model.name}</span>
        </button>
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
        <FileActionsMenu onView={view} onDownload={download} />
        <FileContextMenu
          point={contextPoint}
          onClose={() => setContextPoint(null)}
          onView={view}
          onDownload={download}
        />
      </TableCell>
    </TableRow>
  );
}
