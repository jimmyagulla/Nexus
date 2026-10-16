import type { UseFormReturn } from 'react-hook-form';
import type {
  DocumentUploadPresenter,
  DocumentUploadViewModel,
} from '../../../../adapters/presenters/documents/document-upload.presenter';
import type { DocumentUploadValues } from './document-upload.schema';

/** What the desktop and the mobile upload fields share. */
export interface DocumentUploadFieldsProps {
  form: UseFormReturn<DocumentUploadValues>;
  /** Stable key of each picked file, in order. */
  fileKeys: string[];
  model: DocumentUploadViewModel;
  presenter: DocumentUploadPresenter;
  /** Translates an error code of the schema; null when there is none. */
  describeError: (code: string | undefined) => string | null;
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
}
