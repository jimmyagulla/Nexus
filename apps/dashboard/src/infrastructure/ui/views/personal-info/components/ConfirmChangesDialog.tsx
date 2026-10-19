import { SubmissionError } from '../../../common/errors/SubmissionError';
import { InfoNote } from '../../../common/feedback/InfoNote';
import { i18n } from '../../../i18n/i18n';
import { Button } from '../../../shared/button';
import {
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../shared/dialog';
import { ChangeRow } from './ChangeRow';
import type { ConfirmChangesModel } from '../../../../../adapters/presenters/personal-info/confirm-changes.presenter';

interface ConfirmChangesDialogProps {
  model: ConfirmChangesModel;
  submitting: boolean;
  submissionError: string | null;
  /** "Confirmer": saves the changes. */
  onConfirm: () => void;
}

/** P3.3 — recap of the changed fields, rendered inside a Dialog over the edition modal. */
export function ConfirmChangesDialog({
  model,
  submitting,
  submissionError,
  onConfirm,
}: ConfirmChangesDialogProps) {
  const labels = i18n.messages.personalInfo.confirm;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{labels.title}</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <DialogDescription>{labels.description}</DialogDescription>
        <div className="rounded-lg border border-border">
          {model.changes.map((change) => (
            <ChangeRow key={change.id} model={change} />
          ))}
        </div>
        <InfoNote
          className="bg-accent"
          icon={<i aria-hidden className="ri-mail-send-line text-18 text-link" />}
        >
          <span className="block text-heading">{model.emailNotice}</span>
        </InfoNote>
        <SubmissionError message={submissionError} />
      </DialogBody>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" disabled={submitting}>
            {labels.back}
          </Button>
        </DialogClose>
        <Button className="px-5" disabled={submitting} onClick={onConfirm}>
          {submitting && <i aria-hidden className="ri-loader-4-line animate-spin" />}
          {labels.confirm}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
