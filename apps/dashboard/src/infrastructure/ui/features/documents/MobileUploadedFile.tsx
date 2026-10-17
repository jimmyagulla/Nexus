import type { UseFormRegisterReturn } from 'react-hook-form';
import { i18n } from '../../i18n/i18n';
import { Input } from '../../shared/input';
import { FieldError } from '../../common/errors/FieldError';

interface MobileUploadedFileProps {
  id: string;
  name: string;
  details: string;
  /** Remix Icon class of the file kind. */
  icon: string;
  nameField: UseFormRegisterReturn;
  nameMaxLength: number;
  error: string | null;
  onRemove: () => void;
}

/** Imported file row of the mobile upload form, then the document name. */
export function MobileUploadedFile({
  id,
  name,
  details,
  icon,
  nameField,
  nameMaxLength,
  error,
  onRemove,
}: MobileUploadedFileProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5">
        <i aria-hidden className={`${icon} text-20 text-primary`} />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-14 font-semibold">{name}</span>
          <span className="text-12 text-subtle">{details}</span>
        </div>
        <i aria-hidden className="ri-checkbox-circle-fill text-20 text-green-500" />
        <button
          type="button"
          aria-label={`${i18n.messages.common.removeFile} ${name}`}
          onClick={onRemove}
          className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:shadow-focus"
        >
          <i aria-hidden className="ri-close-line text-20" />
        </button>
      </div>
      <Input
        id={id}
        aria-label={`${i18n.messages.documents.upload.name} — ${name}`}
        placeholder={i18n.messages.documents.upload.name}
        maxLength={nameMaxLength}
        aria-invalid={error !== null}
        {...nameField}
      />
      <FieldError message={error} />
    </div>
  );
}
