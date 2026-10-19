import { ReactNode } from 'react';
import { SubmissionError } from '../../common/errors/SubmissionError';
import { i18n } from '../../i18n/i18n';
import { Button } from '../../shared/button';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ModalBody,
} from '../../shared/dialog';

interface ExpenseReportEditorProps {
  title: string;
  intro: string;
  submitLabel: string;
  submitIcon: string;
  /** The expense report form, shown in the body. */
  children: ReactNode;
  /** Id of that form: the footer's submit button sends it from outside. */
  formId: string;
  submitting: boolean;
  submissionError: string | null;
}

/** A new expense report, or the change of one, in a modal: header, body, footer. */
export function ExpenseReportEditor({
  title,
  intro,
  submitLabel,
  submitIcon,
  children,
  formId,
  submitting,
  submissionError,
}: ExpenseReportEditorProps) {
  return (
    <>
      <DialogHeader className="items-start">
        <div className="flex min-w-0 flex-col gap-1">
          <DialogTitle className="text-24 leading-8">{title}</DialogTitle>
          <DialogDescription className="text-14 text-muted-foreground">{intro}</DialogDescription>
        </div>
      </DialogHeader>
      <ModalBody>
        {children}
        <div className="px-6 pb-5 empty:hidden">
          <SubmissionError message={submissionError} />
        </div>
      </ModalBody>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            {i18n.messages.common.cancel}
          </Button>
        </DialogClose>
        <Button type="submit" form={formId} disabled={submitting} className="px-5">
          <i aria-hidden className={submitting ? 'ri-loader-4-line animate-spin' : submitIcon} />
          {submitLabel}
        </Button>
      </DialogFooter>
    </>
  );
}
