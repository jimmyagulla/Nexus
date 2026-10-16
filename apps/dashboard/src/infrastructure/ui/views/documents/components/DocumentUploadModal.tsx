import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentName } from '@hexagonal-monorepo-template/domain';
import { DocumentUploadForm } from '../../../features/documents/DocumentUploadForm';
import { MobileDocumentUploadForm } from '../../../features/documents/MobileDocumentUploadForm';
import {
  documentUploadSchema,
  type DocumentUploadValues,
} from '../../../features/documents/document-upload.schema';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { cn } from '../../../lib/utils';
import { Dialog, ModalContent } from '../../../shared/dialog';
import { DocumentUpload } from '../DocumentUpload';
import type { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import type {
  DocumentUploadPresenter,
  DocumentUploadViewModel,
} from '../../../../../adapters/presenters/documents/document-upload.presenter';

interface DocumentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: DocumentUploadViewModel;
  presenter: DocumentUploadPresenter;
  errorPresenter: ErrorPresenter;
  submitting: boolean;
  submissionError: string | null;
  /** Resolves true once the documents are deposited. */
  onSubmit: (values: DocumentUploadValues) => Promise<boolean>;
}

/** The upload form, in a modal over the documents list. */
export function DocumentUploadModal({
  open,
  onOpenChange,
  model,
  presenter,
  errorPresenter,
  submitting,
  submissionError,
  onSubmit,
}: DocumentUploadModalProps) {
  const desktop = useMediaQuery('(min-width: 768px)');
  const form = useForm<DocumentUploadValues>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: { category: model.defaultType, files: [], comment: '' },
  });
  const files = useFieldArray({ control: form.control, name: 'files' });

  // A closed modal forgets what was typed in it.
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const fieldsProps = {
    form,
    fileKeys: files.fields.map((field) => field.id),
    model,
    presenter,
    describeError: (code: string | undefined) =>
      code === undefined ? null : errorPresenter.present(code),
    onAddFiles: (picked: File[]) => {
      if (picked.length === 0) {
        return;
      }
      files.append(picked.map((file) => ({ file, name: DocumentName.proposedFor(file.name) })));
      void form.trigger('files');
    },
    onRemoveFile: (index: number) => {
      files.remove(index);
      void form.trigger('files');
    },
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (submitting ? undefined : onOpenChange(next))}>
      <ModalContent
        className={cn(desktop ? 'w-190' : 'inset-0 max-h-none max-w-none translate-0 rounded-none')}
      >
        <DocumentUpload
          desktop={desktop}
          fields={
            desktop ? (
              <DocumentUploadForm {...fieldsProps} />
            ) : (
              <MobileDocumentUploadForm {...fieldsProps} />
            )
          }
          onSubmit={form.handleSubmit(async (values) => {
            if (await onSubmit(values)) {
              onOpenChange(false);
            }
          })}
          submitting={submitting}
          submissionError={submissionError}
        />
      </ModalContent>
    </Dialog>
  );
}
