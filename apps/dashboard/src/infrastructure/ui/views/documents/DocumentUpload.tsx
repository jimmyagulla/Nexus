import { FormEventHandler, ReactNode } from 'react';
import { SubmissionError } from '../../common/errors/SubmissionError';
import { PageHeader } from '../../common/page/PageHeader';
import { i18n } from '../../i18n/i18n';
import { Button } from '../../shared/button';
import { Card, CardFooter } from '../../shared/card';
import { DialogClose, DialogDescription, DialogTitle } from '../../shared/dialog';

interface DocumentUploadProps {
  /** Desktop layout (P2.2) or mobile layout (M.3). */
  desktop: boolean;
  /** The fields of the matching layout. */
  fields: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  submitting: boolean;
  submissionError: string | null;
}

/**
 * P2.2 — upload a document to HR, laid out exactly as the page of the mockup,
 * shown in a modal over the documents list. M.3 below `md`.
 */
export function DocumentUpload({
  desktop,
  fields,
  onSubmit,
  submitting,
  submissionError,
}: DocumentUploadProps) {
  const labels = i18n.messages.documents.upload;
  const submitLabel = (
    <>
      <i aria-hidden className={submitting ? 'ri-loader-4-line animate-spin' : 'ri-send-plane-line'} />
      {labels.submit}
    </>
  );

  return (
    <form noValidate onSubmit={onSubmit} aria-busy={submitting} className="contents">
      <DialogTitle className="sr-only">{labels.title}</DialogTitle>
      <DialogDescription className="sr-only">{labels.description}</DialogDescription>
      {desktop ? (
        <div className="flex flex-col items-center gap-4 px-10 pb-5.5 pt-6">
          <PageHeader
            size="form"
            title={labels.title}
            description={labels.description}
            className="w-190"
          />
          <Card className="flex w-190 flex-col">
            {fields}
            <div className="px-6 empty:hidden">
              <SubmissionError message={submissionError} />
            </div>
            <CardFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {i18n.messages.common.cancel}
                </Button>
              </DialogClose>
              <Button type="submit" className="px-5" disabled={submitting}>
                {submitLabel}
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="flex min-h-full flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-border bg-card px-5 py-3">
            <span aria-hidden className="text-16 font-bold text-heading">{labels.title}</span>
            <DialogClose className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:shadow-focus">
              <i aria-hidden className="ri-close-line text-22" />
              <span className="sr-only">{i18n.messages.common.close}</span>
            </DialogClose>
          </div>
          <div className="flex-1 p-5">{fields}</div>
          <div className="border-t border-border bg-card px-5 pb-7 pt-3">
            <SubmissionError message={submissionError} />
            <Button type="submit" className="h-13 w-full text-16" disabled={submitting}>
              {submitLabel}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
