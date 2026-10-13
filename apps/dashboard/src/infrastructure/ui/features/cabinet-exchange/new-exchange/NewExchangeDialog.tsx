import { useState } from 'react';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { Button } from '../../../shared/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../shared/dialog';
import { i18n } from '../../../i18n/i18n';
import { NewExchangeForm } from './NewExchangeForm';
import type { NewExchangeValues } from './new-exchange.schema';

interface NewExchangeDialogProps {
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (values: NewExchangeValues) => Promise<boolean>;
}

export function NewExchangeDialog({
  errorPresenter,
  submissionError,
  onSubmit,
}: NewExchangeDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">{i18n.messages.cabinet.newDocument}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{i18n.messages.cabinet.newDocumentTitle}</DialogTitle>
        </DialogHeader>
        <NewExchangeForm
          errorPresenter={errorPresenter}
          submissionError={submissionError}
          submitLabel={i18n.messages.cabinet.saveDraft}
          onSubmit={async (values) => {
            const accepted = await onSubmit(values);
            if (accepted) {
              setOpen(false);
            }
            return accepted;
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
