import type { UseFormReturn } from 'react-hook-form';
import type { DocumentUploadValues } from './document-upload.schema';

/** Refusal of a picked file, else of its name. */
export function fileEntryError(
  form: UseFormReturn<DocumentUploadValues>,
  index: number,
): string | undefined {
  const entry = form.formState.errors.files?.[index];
  return entry?.file?.message ?? entry?.name?.message;
}

/** Refusal of the list itself: no file, too many files. */
export function filesError(
  form: UseFormReturn<DocumentUploadValues>,
): string | undefined {
  const errors = form.formState.errors.files;
  return errors?.message ?? errors?.root?.message;
}
