import { i18n } from '../../../i18n/i18n';
import { DropdownMenuItem } from '../../../shared/dropdown-menu';

interface DocumentActionsItemsProps {
  onView: () => void;
  onDownload: () => void;
}

/** The actions on a document, shared by the "…" menu and the right-click menu. */
export function DocumentActionsItems({ onView, onDownload }: DocumentActionsItemsProps) {
  const labels = i18n.messages.documents.list.actions;

  return (
    <>
      <DropdownMenuItem onSelect={onView}>
        <i aria-hidden className="ri-eye-line" />
        {labels.view}
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={onDownload}>
        <i aria-hidden className="ri-download-2-line" />
        {labels.download}
      </DropdownMenuItem>
    </>
  );
}
