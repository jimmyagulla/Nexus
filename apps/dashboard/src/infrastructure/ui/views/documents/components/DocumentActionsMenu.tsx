import { RowAction } from '../../../common/data/RowAction';
import { i18n } from '../../../i18n/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../shared/dropdown-menu';

interface DocumentActionsMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onView: () => void;
  onDownload: () => void;
}

/** "…" button of a document row and the actions it opens. */
export function DocumentActionsMenu({
  open,
  onOpenChange,
  onView,
  onDownload,
}: DocumentActionsMenuProps) {
  const labels = i18n.messages.documents.list.actions;

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange} modal={false}>
      <DropdownMenuTrigger asChild>
        <RowAction
          label={i18n.messages.common.more}
          icon={<i aria-hidden className="ri-more-2-fill" />}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onView}>
          <i aria-hidden className="ri-eye-line" />
          {labels.view}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onDownload}>
          <i aria-hidden className="ri-download-2-line" />
          {labels.download}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
