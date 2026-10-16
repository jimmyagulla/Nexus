import { PageStatus } from '../../../common/feedback/PageStatus';
import { i18n } from '../../../i18n/i18n';
import { Button } from '../../../shared/button';
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  ModalBody,
  ModalContent,
} from '../../../shared/dialog';
import { DocumentViewer } from './DocumentViewer';
import type { DocumentPreview } from '../../../hooks/useViewDocument';

interface DocumentPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Name of the document, shown while it loads. */
  title: string;
  preview: DocumentPreview | undefined;
  loading: boolean;
  /** Translated failure, if the document could not be opened. */
  error: string | null;
  onDownload: () => void;
}

/** In-app document reader: name and download at the top, the document below. */
export function DocumentPreviewModal({
  open,
  onOpenChange,
  title,
  preview,
  loading,
  error,
  onDownload,
}: DocumentPreviewModalProps) {
  const labels = i18n.messages.documents;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ModalContent className="h-[calc(100%-2rem)] w-240">
        <DialogHeader>
          <div className="flex min-w-0 flex-1 flex-col">
            <DialogTitle className="truncate">{title}</DialogTitle>
            <DialogDescription className="sr-only">{labels.preview.loading}</DialogDescription>
          </div>
          <Button type="button" variant="outline" onClick={onDownload} disabled={preview === undefined}>
            <i aria-hidden className="ri-download-2-line text-18" />
            {labels.list.actions.download}
          </Button>
        </DialogHeader>
        <ModalBody className="flex flex-col">
          {loading && <PageStatus>{labels.preview.loading}</PageStatus>}
          {error !== null && <PageStatus>{error}</PageStatus>}
          {preview !== undefined && <DocumentViewer preview={preview} />}
        </ModalBody>
      </ModalContent>
    </Dialog>
  );
}
