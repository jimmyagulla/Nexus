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
import { ReceiptForm } from './ReceiptForm';
import type { ReceiptValues } from './receipt.schema';

interface AttachReceiptDialogProps {
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (values: ReceiptValues) => Promise<boolean>;
}

export function AttachReceiptDialog({
  errorPresenter,
  submissionError,
  onSubmit,
}: AttachReceiptDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">{i18n.messages.expenseReports.attachReceipt}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {i18n.messages.expenseReports.attachReceiptTitle}
          </DialogTitle>
        </DialogHeader>
        <ReceiptForm
          errorPresenter={errorPresenter}
          submissionError={submissionError}
          onSubmit={async (values) => {
            const attached = await onSubmit(values);
            if (attached) {
              setOpen(false);
            }
            return attached;
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
