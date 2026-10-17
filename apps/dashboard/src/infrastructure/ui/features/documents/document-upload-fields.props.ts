import type { UseFormReturn } from 'react-hook-form';
import type { CharacterCounterPresenter } from '../../../../adapters/presenters/documents/character-counter.presenter';
import type { DocumentTypeOptionModel } from '../../../../adapters/presenters/documents/document-type-options.presenter';
import type { DocumentUploadViewModel } from '../../../../adapters/presenters/documents/document-upload.presenter';
import type { UploadedFilePresenter } from '../../../../adapters/presenters/documents/uploaded-file.presenter';
import type { DocumentUploadValues } from './document-upload.schema';

/** What the desktop and the mobile upload fields share. */
export interface DocumentUploadFieldsProps {
  form: UseFormReturn<DocumentUploadValues>;
  /** Stable key of each picked file, in order. */
  fileKeys: string[];
  model: DocumentUploadViewModel;
  types: DocumentTypeOptionModel[];
  uploadedFilePresenter: UploadedFilePresenter;
  counterPresenter: CharacterCounterPresenter;
  /** Translates an error code of the schema; null when there is none. */
  describeError: (code: string | undefined) => string | null;
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
}
