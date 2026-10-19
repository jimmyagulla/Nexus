import { DragEvent, useState } from 'react';
import { cn } from '../../lib/utils';

interface FileDropzoneProps {
  /** "Glissez votre fichier ici ou" */
  prompt: string;
  /** "sélectionnez un fichier" */
  action: string;
  /** "PDF, JPG, PNG · 10 Mo max." */
  hint?: string;
  multiple?: boolean;
  /** `accept` of the native file picker. */
  accept?: string;
  /** Files picked with the native explorer or dropped on the area. */
  onFiles?: (files: File[]) => void;
  className?: string;
}

/** Dashed drop area of the upload forms: icon, prompt and action are 12px-apart flex items, as in the mockup. */
export function FileDropzone({
  prompt,
  action,
  hint,
  multiple,
  accept,
  onFiles,
  className,
}: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);

  const drop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    onFiles?.(Array.from(event.dataTransfer.files));
  };

  return (
    <label
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={drop}
      className={cn(
        'flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-dashed border-disabled bg-blue-25 p-4 text-14 text-muted-foreground transition-colors hover:border-primary focus-within:shadow-focus',
        dragging && 'border-primary',
        className,
      )}
    >
      <i aria-hidden className="ri-upload-cloud-2-line text-24 text-link" />
      {prompt}
      <b className="text-link">{action}</b>
      {hint && <span className="text-12 text-subtle">{hint}</span>}
      <input
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={(event) => {
          onFiles?.(Array.from(event.target.files ?? []));
          event.target.value = '';
        }}
        className="sr-only"
      />
    </label>
  );
}
