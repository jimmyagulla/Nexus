import { useState } from 'react';
import type { EmployeeOptionViewModel } from '../../../../../adapters/presenters/presence.presenter';
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
import { OpenPresenceForm } from './OpenPresenceForm';
import type { OpenPresenceValues } from './open-presence.schema';

interface OpenPresenceDialogProps {
  employees: EmployeeOptionViewModel[];
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (values: OpenPresenceValues) => Promise<boolean>;
}

export function OpenPresenceDialog({
  employees,
  errorPresenter,
  submissionError,
  onSubmit,
}: OpenPresenceDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">{i18n.messages.presences.openMonth}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{i18n.messages.presences.openMonthTitle}</DialogTitle>
        </DialogHeader>
        <OpenPresenceForm
          employees={employees}
          errorPresenter={errorPresenter}
          submissionError={submissionError}
          onSubmit={async (values) => {
            const opened = await onSubmit(values);
            if (opened) {
              setOpen(false);
            }
            return opened;
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
