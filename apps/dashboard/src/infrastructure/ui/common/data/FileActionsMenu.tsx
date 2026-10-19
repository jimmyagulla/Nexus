import { i18n } from '../../i18n/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../shared/dropdown-menu';
import { FileActionsItems } from './FileActionsItems';
import { RowAction } from './RowAction';

interface FileActionsMenuProps {
  onView: () => void;
  onDownload: () => void;
}

/** "…" button of a file row and the actions it opens. */
export function FileActionsMenu({ onView, onDownload }: FileActionsMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <RowAction
          label={i18n.messages.common.more}
          icon={<i aria-hidden className="ri-more-2-fill" />}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <FileActionsItems onView={onView} onDownload={onDownload} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
