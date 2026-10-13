import { useState } from 'react';
import type { ExpenseCategoryViewModel } from '../../../../../adapters/presenters/expense-category.presenter';
import type { ExpenseFieldsViewModel } from '../../../../../adapters/presenters/expense-report.presenter';
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

interface EditExpenseDialogProps {
  fields: ExpenseFieldsViewModel;
  categories: ExpenseCategoryViewModel[];
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (values: ExpenseValues) => Promise<boolean>;
}

export function EditExpenseDialog({
  fields,
  categories,
  errorPresenter,
  submissionError,
  onSubmit,
}: EditExpenseDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          {i18n.messages.expenseReports.editExpense}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{i18n.messages.expenseReports.editExpenseTitle}</DialogTitle>
        </DialogHeader>
        <ExpenseForm
          categories={categories}
          errorPresenter={errorPresenter}
          submissionError={submissionError}
          initialValues={fields}
          submitLabel={i18n.messages.expenseReports.saveExpense}
          onSubmit={async (values) => {
            const saved = await onSubmit(values);
            if (saved) {
              setOpen(false);
            }
            return saved;
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
