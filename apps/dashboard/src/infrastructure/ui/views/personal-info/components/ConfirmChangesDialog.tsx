import { Link } from '@tanstack/react-router';
import { InfoNote } from '../../../common/feedback/InfoNote';
import { i18n } from '../../../i18n/i18n';
import { AppRoutes } from '../../../routes/app-routes';
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
import { ChangeRow, type ChangeModel } from './ChangeRow';

export interface ConfirmChangesViewModel {
  changes: ChangeModel[];
  /** "Un e-mail de confirmation sera envoyé à … et le service RH sera informé." */
  emailNotice: string;
}

interface ConfirmChangesDialogProps {
  model: ConfirmChangesViewModel;
}

/** P3.3 — recap of the changed fields, rendered inside a Dialog. */
export function ConfirmChangesDialog({ model }: ConfirmChangesDialogProps) {
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
      </DialogBody>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">{labels.back}</Button>
        </DialogClose>
        <Button asChild className="px-5">
          <Link to={AppRoutes.personalInfoUpdated}>{labels.confirm}</Link>
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
