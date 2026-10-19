import { FileDropzone } from '../../common/forms/FileDropzone';
import { UploadedFile } from '../../common/forms/UploadedFile';
import { i18n } from '../../i18n/i18n';

interface ExpenseProofFieldProps {
  /** The receipt shown: picked now, or already attached; null when there is none. */
  file: { name: string; details: string; icon: string } | null;
  accept: string;
  hint: string;
  onPick: (file: File) => void;
  onRemove: () => void;
}

/** Receipt of the form: a drop area, or the receipt with its remove cross. */
export function ExpenseProofField({ file, accept, hint, onPick, onRemove }: ExpenseProofFieldProps) {
  const labels = i18n.messages.expenseReports.form;

  if (file !== null) {
    return (
      <UploadedFile
        name={file.name}
        details={file.details}
        icon={<i aria-hidden className={`${file.icon} text-22 shrink-0 text-primary`} />}
        onRemove={onRemove}
      />
    );
  }

  return (
    <FileDropzone
      prompt={labels.dropzonePrompt}
      action={labels.dropzoneAction}
      hint={hint}
      accept={accept}
      onFiles={(picked) => {
        if (picked[0] !== undefined) {
          onPick(picked[0]);
        }
      }}
      className="[&>span]:contents"
    />
  );
}
