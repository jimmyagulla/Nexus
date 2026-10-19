import { i18n } from '../../i18n/i18n';
import type { FilePreview } from '../../lib/file-preview';

interface FileViewerProps {
  preview: FilePreview;
}

/** Shows a file inside the app: PDF, image or text; a notice otherwise. */
export function FileViewer({ preview }: FileViewerProps) {
  if (preview.contentType === 'application/pdf') {
    return (
      <iframe
        title={preview.fileName}
        src={preview.objectUrl}
        className="w-full flex-1 border-0 bg-muted"
      />
    );
  }

  if (preview.contentType.startsWith('image/')) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-4">
        <img
          src={preview.objectUrl}
          alt={preview.fileName}
          className="max-h-full max-w-full rounded-sm object-contain"
        />
      </div>
    );
  }

  if (preview.text !== null) {
    return (
      <pre className="flex-1 overflow-auto whitespace-pre p-6 text-13 text-foreground">
        {preview.text}
      </pre>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center text-14 text-muted-foreground">
      <i aria-hidden className="ri-file-excel-2-line text-32 text-primary" />
      {i18n.messages.common.preview.unavailable}
    </div>
  );
}
