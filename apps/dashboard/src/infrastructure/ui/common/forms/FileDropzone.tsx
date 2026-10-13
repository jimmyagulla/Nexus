import { cn } from '../../lib/utils';

interface FileDropzoneProps {
  /** "Glissez votre fichier ici ou" */
  prompt: string;
  /** "sélectionnez un fichier" */
  action: string;
  /** "PDF, JPG, PNG · 10 Mo max." */
  hint?: string;
  multiple?: boolean;
  className?: string;
}

/** Dashed drop area of the upload forms: icon, prompt and action are 12px-apart flex items, as in the mockup. */
export function FileDropzone({
  prompt,
  action,
  hint,
  multiple,
  className,
}: FileDropzoneProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-dashed border-disabled bg-blue-25 p-4 text-14 text-muted-foreground transition-colors hover:border-primary',
        className,
      )}
    >
      <i aria-hidden className="ri-upload-cloud-2-line text-24 text-link" />
      {prompt}
      <b className="text-link">{action}</b>
      {hint && <span className="text-12 text-subtle">{hint}</span>}
      <input type="file" multiple={multiple} className="sr-only" />
    </label>
  );
}
