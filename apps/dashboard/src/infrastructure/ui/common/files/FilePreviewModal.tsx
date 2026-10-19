import { i18n } from '../../i18n/i18n';
import type { FilePreview } from '../../lib/file-preview';
import { Button } from '../../shared/button';
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  ModalBody,
  ModalContent,
} from '../../shared/dialog';
import { PageStatus } from '../feedback/PageStatus';
import { FileViewer } from './FileViewer';

interface FilePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Name of the file, shown while it loads. */
  title: string;
  preview: FilePreview | undefined;
  loading: boolean;
  /** Translated failure, if the file could not be opened. */
  error: string | null;
  onDownload: () => void;
}

/** In-app file reader: name and download at the top, the file below. */
export function FilePreviewModal({
  open,
  onOpenChange,
  title,
  preview,
  loading,
  error,
  onDownload,
}: FilePreviewModalProps) {
  const labels = i18n.messages.common;

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
            {labels.download}
          </Button>
        </DialogHeader>
        <ModalBody className="flex flex-col">
          {loading && <PageStatus>{labels.preview.loading}</PageStatus>}
          {error !== null && <PageStatus>{error}</PageStatus>}
          {preview !== undefined && <FileViewer preview={preview} />}
        </ModalBody>
      </ModalContent>
    </Dialog>
  );
}
