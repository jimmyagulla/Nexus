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
import { CreateExpenseReportForm } from './CreateExpenseReportForm';
import type { CreateExpenseReportValues } from './create-expense-report.schema';

interface CreateExpenseReportDialogProps {
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (values: CreateExpenseReportValues) => Promise<boolean>;
}

export function CreateExpenseReportDialog({
  errorPresenter,
  submissionError,
  onSubmit,
}: CreateExpenseReportDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">{i18n.messages.expenseReports.create}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{i18n.messages.expenseReports.createTitle}</DialogTitle>
        </DialogHeader>
        <CreateExpenseReportForm
          errorPresenter={errorPresenter}
          submissionError={submissionError}
          onSubmit={async (values) => {
            const created = await onSubmit(values);
            if (created) {
              setOpen(false);
            }
            return created;
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
