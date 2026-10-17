import { RowAction } from '../../../common/data/RowAction';
import { i18n } from '../../../i18n/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../../shared/dropdown-menu';
import { DocumentActionsItems } from './DocumentActionsItems';

interface DocumentActionsMenuProps {
  onView: () => void;
  onDownload: () => void;
}

/** "…" button of a document row and the actions it opens. */
export function DocumentActionsMenu({ onView, onDownload }: DocumentActionsMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <RowAction
          label={i18n.messages.common.more}
          icon={<i aria-hidden className="ri-more-2-fill" />}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DocumentActionsItems onView={onView} onDownload={onDownload} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
