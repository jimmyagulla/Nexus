import { useState } from 'react';
import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { Button } from '../../shared/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../shared/dialog';
import { fr } from '../../i18n/fr';
import { PublicHolidayForm } from './PublicHolidayForm';
import type { PublicHolidayValues } from './public-holiday.schema';

interface AddPublicHolidayDialogProps {
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (values: PublicHolidayValues) => Promise<boolean>;
}

export function AddPublicHolidayDialog({
  errorPresenter,
  submissionError,
  onSubmit,
}: AddPublicHolidayDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">{fr.settings.addHoliday}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.settings.addHolidayTitle}</DialogTitle>
        </DialogHeader>
        <PublicHolidayForm
          errorPresenter={errorPresenter}
          submissionError={submissionError}
          onSubmit={async (values) => {
            const retained = await onSubmit(values);
            if (retained) {
              setOpen(false);
            }
            return retained;
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
