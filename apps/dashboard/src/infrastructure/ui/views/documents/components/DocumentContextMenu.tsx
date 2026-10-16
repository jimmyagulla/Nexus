import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../../shared/dropdown-menu';
import { DocumentActionsItems } from './DocumentActionsItems';

interface DocumentContextMenuProps {
  /** Where the right click happened, in viewport pixels; null while closed. */
  point: { x: number; y: number } | null;
  onClose: () => void;
  onView: () => void;
  onDownload: () => void;
}

/** The actions of a row, opened under the cursor by a right click. */
export function DocumentContextMenu({ point, onClose, onView, onDownload }: DocumentContextMenuProps) {
  return (
    <DropdownMenu
      modal={false}
      open={point !== null}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        {/* Zero-size anchor placed under the cursor; the coordinates are runtime values. */}
        <span
          aria-hidden
          tabIndex={-1}
          className="pointer-events-none fixed size-0"
          style={{ left: point?.x ?? 0, top: point?.y ?? 0 }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom" sideOffset={2}>
        <DocumentActionsItems onView={onView} onDownload={onDownload} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
