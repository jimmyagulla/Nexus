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
import { i18n } from '../../i18n/i18n';
import { ExpenseCategoryForm } from './ExpenseCategoryForm';
import type { ExpenseCategoryValues } from './expense-category.schema';

interface AddExpenseCategoryDialogProps {
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (values: ExpenseCategoryValues) => Promise<boolean>;
}

export function AddExpenseCategoryDialog({
  errorPresenter,
  submissionError,
  onSubmit,
}: AddExpenseCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">{i18n.messages.expenseCategories.add}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{i18n.messages.expenseCategories.add}</DialogTitle>
        </DialogHeader>
        <ExpenseCategoryForm
          errorPresenter={errorPresenter}
          submissionError={submissionError}
          onSubmit={async (values) => {
            const added = await onSubmit(values);
            if (added) {
              setOpen(false);
            }
            return added;
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
