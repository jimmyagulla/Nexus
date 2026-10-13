import { useState } from 'react';
import type { ExpenseCategoryViewModel } from '../../../../../adapters/presenters/expense-category.presenter';
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
import { ExpenseForm } from './ExpenseForm';
import type { ExpenseValues } from './expense.schema';

interface AddExpenseDialogProps {
  categories: ExpenseCategoryViewModel[];
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (values: ExpenseValues) => Promise<boolean>;
}

export function AddExpenseDialog({
  categories,
  errorPresenter,
  submissionError,
  onSubmit,
}: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">{i18n.messages.expenseReports.addExpense}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{i18n.messages.expenseReports.addExpenseTitle}</DialogTitle>
        </DialogHeader>
        <ExpenseForm
          categories={categories}
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
