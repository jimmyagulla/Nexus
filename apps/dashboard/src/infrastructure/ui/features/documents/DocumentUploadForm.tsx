import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentName } from '@hexagonal-monorepo-template/domain';
import { DocumentUploadFields } from './DocumentUploadFields';
import { MobileDocumentUploadFields } from './MobileDocumentUploadFields';
import {
  documentUploadSchema,
  type DocumentUploadValues,
} from './document-upload.schema';
import type { DocumentUploadFieldsProps } from './document-upload-fields.props';
import type { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';

/** Id of the upload <form>, for a submit button placed outside of it (`form` attribute). */
export const DOCUMENT_UPLOAD_FORM_ID = 'document-upload-form';

interface DocumentUploadFormProps
  extends Pick<DocumentUploadFieldsProps, 'model' | 'types' | 'uploadedFilePresenter' | 'counterPresenter'> {
  /** Desktop fields (P2.2) or mobile fields (M.3). */
  desktop: boolean;
  errorPresenter: ErrorPresenter;
  submitting: boolean;
  onSubmit: (values: DocumentUploadValues) => void | Promise<void>;
}

/**
 * The upload form: its state, its validation and its <form> element. The
 * layout around it (header, footer, submit button) belongs to the view.
 */
export function DocumentUploadForm({
  desktop,
  model,
  types,
  uploadedFilePresenter,
  counterPresenter,
  errorPresenter,
  submitting,
  onSubmit,
}: DocumentUploadFormProps) {
  const form = useForm<DocumentUploadValues>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: { category: model.defaultType, files: [], comment: '' },
  });
  const files = useFieldArray({ control: form.control, name: 'files' });

  const fieldsProps: DocumentUploadFieldsProps = {
    form,
    fileKeys: files.fields.map((field) => field.id),
    model,
    types,
    uploadedFilePresenter,
    counterPresenter,
    describeError: (code) => (code === undefined ? null : errorPresenter.present(code)),
    onAddFiles: (picked) => {
      if (picked.length === 0) {
        return;
      }
      files.append(picked.map((file) => ({ file, name: DocumentName.proposedFor(file.name) })));
      void form.trigger('files');
    },
    onRemoveFile: (index) => {
      files.remove(index);
      void form.trigger('files');
    },
  };

  return (
    <form
      id={DOCUMENT_UPLOAD_FORM_ID}
      noValidate
      aria-busy={submitting}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {desktop ? (
        <DocumentUploadFields {...fieldsProps} />
      ) : (
        <MobileDocumentUploadFields {...fieldsProps} />
      )}
    </form>
  );
}
