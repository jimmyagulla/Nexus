import {
  DOCUMENT_UPLOAD_FORM_ID,
  DocumentUploadForm,
} from '../../../features/documents/DocumentUploadForm';
import type { DocumentUploadValues } from '../../../features/documents/document-upload.schema';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { cn } from '../../../lib/utils';
import { Dialog, ModalContent } from '../../../shared/dialog';
import { DocumentUpload } from '../DocumentUpload';
import type { DocumentUploadPresenters } from '../../../../composition/document/documents-page.composition';
import type { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import type { DocumentTypeOptionModel } from '../../../../../adapters/presenters/documents/document-type-options.presenter';
import type { DocumentUploadViewModel } from '../../../../../adapters/presenters/documents/document-upload.presenter';

interface DocumentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: DocumentUploadViewModel;
  types: DocumentTypeOptionModel[];
  presenters: Pick<DocumentUploadPresenters, 'uploadedFile' | 'counter'>;
  errorPresenter: ErrorPresenter;
  submitting: boolean;
  submissionError: string | null;
  /** Resolves true once the documents are deposited. */
  onSubmit: (values: DocumentUploadValues) => Promise<boolean>;
}

/**
 * The upload form, in a modal over the documents list. Closing the modal
 * unmounts the form, so that it forgets what was typed in it.
 */
export function DocumentUploadModal({
  open,
  onOpenChange,
  model,
  types,
  presenters,
  errorPresenter,
  submitting,
  submissionError,
  onSubmit,
}: DocumentUploadModalProps) {
  const desktop = useMediaQuery('(min-width: 768px)');

  return (
    <Dialog open={open} onOpenChange={(next) => (submitting ? undefined : onOpenChange(next))}>
      <ModalContent
        className={cn(desktop ? 'w-190' : 'inset-0 max-h-none max-w-none translate-0 rounded-none')}
      >
        <DocumentUpload
          desktop={desktop}
          formId={DOCUMENT_UPLOAD_FORM_ID}
          submitting={submitting}
          submissionError={submissionError}
        >
          <DocumentUploadForm
            desktop={desktop}
            model={model}
            types={types}
            uploadedFilePresenter={presenters.uploadedFile}
            counterPresenter={presenters.counter}
            errorPresenter={errorPresenter}
            submitting={submitting}
            onSubmit={async (values) => {
              if (await onSubmit(values)) {
                onOpenChange(false);
              }
            }}
          />
        </DocumentUpload>
      </ModalContent>
    </Dialog>
  );
}
