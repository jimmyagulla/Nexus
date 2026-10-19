import { i18n } from '../../i18n/i18n';
import { DropdownMenuItem } from '../../shared/dropdown-menu';

interface FileActionsItemsProps {
  onView: () => void;
  onDownload: () => void;
}

/** The actions on a file of a list, shared by the "…" menu and the right-click menu. */
export function FileActionsItems({ onView, onDownload }: FileActionsItemsProps) {
  const labels = i18n.messages.common.fileActions;

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
