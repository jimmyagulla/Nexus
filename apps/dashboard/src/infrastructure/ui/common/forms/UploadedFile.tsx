import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { i18n } from '../../i18n/i18n';

interface UploadedFileProps {
  name: string;
  /** "1,2 Mo · Importé" */
  details: string;
  /** Defaults to the PDF glyph. */
  icon?: ReactNode;
  onRemove?: () => void;
  className?: string;
}

/** Imported file row: type icon, name and size, success check, remove cross. */
export function UploadedFile({ name, details, icon, onRemove, className }: UploadedFileProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border border-border px-3 py-2.5',
        className,
      )}
    >
      {icon ?? <i aria-hidden className="ri-file-pdf-2-line text-22 shrink-0 text-primary" />}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-14 font-semibold">{name}</span>
        <span className="text-12 text-subtle">{details}</span>
      </div>
      <i aria-hidden className="ri-checkbox-circle-fill text-20 shrink-0 text-green-500" />
      <button
        type="button"
        aria-label={`${i18n.messages.common.removeFile} ${name}`}
        onClick={onRemove}
        className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:shadow-focus"
      >
        <i aria-hidden className="ri-close-line text-20" />
      </button>
    </div>
  );
}
