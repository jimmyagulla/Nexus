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
import { AdjustWorkedDaysForm } from './AdjustWorkedDaysForm';
import type { AdjustWorkedDaysValues } from './adjust-worked-days.schema';

interface AdjustWorkedDaysDialogProps {
  workedDays: number;
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (values: AdjustWorkedDaysValues) => Promise<boolean>;
}

export function AdjustWorkedDaysDialog({
  workedDays,
  errorPresenter,
  submissionError,
  onSubmit,
}: AdjustWorkedDaysDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          {i18n.messages.presences.adjust}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{i18n.messages.presences.adjustTitle}</DialogTitle>
        </DialogHeader>
        <AdjustWorkedDaysForm
          workedDays={workedDays}
          errorPresenter={errorPresenter}
          submissionError={submissionError}
          onSubmit={async (values) => {
            const corrected = await onSubmit(values);
            if (corrected) {
              setOpen(false);
            }
            return corrected;
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
