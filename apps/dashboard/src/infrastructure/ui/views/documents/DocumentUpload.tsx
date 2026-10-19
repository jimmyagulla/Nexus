import { ReactNode } from 'react';
import { SubmissionError } from '../../common/errors/SubmissionError';
import { i18n } from '../../i18n/i18n';
import { cn } from '../../lib/utils';
import { Button } from '../../shared/button';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ModalBody,
} from '../../shared/dialog';

interface DocumentUploadProps {
  /** Desktop layout (P2.2) or mobile layout (M.3). */
  desktop: boolean;
  /** The upload form, shown in the body. */
  children: ReactNode;
  /** Id of that form: the footer's submit button sends it from outside. */
  formId: string;
  submitting: boolean;
  submissionError: string | null;
}

/** P2.2 — upload a document to HR, in a modal: header, body, footer. M.3 below `md`. */
export function DocumentUpload({
  desktop,
  children,
  formId,
  submitting,
  submissionError,
}: DocumentUploadProps) {
  const labels = i18n.messages.documents.upload;

  return (
    <>
      <DialogHeader className="items-start">
        <div className="flex min-w-0 flex-col gap-1">
          <DialogTitle className={desktop ? 'text-24 leading-8' : 'text-18'}>
            {labels.title}
          </DialogTitle>
          <DialogDescription className="text-14 text-muted-foreground">
            {labels.description}
          </DialogDescription>
        </div>
      </DialogHeader>
      <ModalBody className={cn(!desktop && 'p-5')}>
        {children}
        <div className={cn('empty:hidden', desktop ? 'px-6 pb-5' : 'pt-4')}>
          <SubmissionError message={submissionError} />
        </div>
      </ModalBody>
      <DialogFooter className={cn(!desktop && 'px-5 pb-7 pt-3')}>
        {desktop && (
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {i18n.messages.common.cancel}
            </Button>
          </DialogClose>
        )}
        <Button
          type="submit"
          form={formId}
          disabled={submitting}
          className={desktop ? 'px-5' : 'h-13 w-full text-16'}
        >
          <i
            aria-hidden
            className={submitting ? 'ri-loader-4-line animate-spin' : 'ri-send-plane-line'}
          />
          {labels.submit}
        </Button>
      </DialogFooter>
    </>
  );
}
