import type { UseFormRegisterReturn } from 'react-hook-form';
import { FieldError } from '../../common/errors/FieldError';
import { UploadedFile } from '../../common/forms/UploadedFile';
import { i18n } from '../../i18n/i18n';
import { Input } from '../../shared/input';
import type { UploadedFileModel } from '../../../../adapters/presenters/documents/uploaded-file.presenter';

interface DocumentFileEntryProps {
  id: string;
  fileName: string;
  model: UploadedFileModel;
  nameField: UseFormRegisterReturn;
  nameMaxLength: number;
  /** Translated refusal of the file or of its name, if any. */
  error: string | null;
  onRemove: () => void;
}

/** A picked file (desktop): its row, then the name the document will carry. */
export function DocumentFileEntry({
  id,
  fileName,
  model,
  nameField,
  nameMaxLength,
  error,
  onRemove,
}: DocumentFileEntryProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <UploadedFile
        name={fileName}
        details={model.details}
        icon={<i aria-hidden className={`${model.icon} text-22 shrink-0 text-primary`} />}
        onRemove={onRemove}
        className={error === null ? undefined : 'border-destructive'}
      />
      <Input
        id={id}
        aria-label={`${i18n.messages.documents.upload.name} — ${fileName}`}
        placeholder={i18n.messages.documents.upload.name}
        maxLength={nameMaxLength}
        aria-invalid={error !== null}
        {...nameField}
      />
      <FieldError message={error} />
    </div>
  );
}
