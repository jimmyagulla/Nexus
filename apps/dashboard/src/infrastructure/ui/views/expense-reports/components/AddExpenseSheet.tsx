import { ExpenseForm } from '../../../features/expense-reports/ExpenseForm';
import { i18n } from '../../../i18n/i18n';
import { Button } from '../../../shared/button';
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../../shared/sheet';
import type { ExpenseFormModel } from '../../../../../adapters/presenters/expense-reports/expense-reports.view-models';

/** P6.2 — floating panel adding an expense to the note. */
export function AddExpenseSheet({ expense }: { expense: ExpenseFormModel }) {
  const labels = i18n.messages.expenseReports;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed bg-accent">
          <i aria-hidden className="ri-add-line" />
          {labels.report.addExpense}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-100.5" aria-describedby={undefined}>
        <SheetHeader className="py-3.5">
          <SheetTitle>{labels.expenseForm.title}</SheetTitle>
        </SheetHeader>
        <SheetBody className="gap-3 px-5 py-3.5 text-14">
          <ExpenseForm expense={expense} />
        </SheetBody>
        <SheetFooter className="justify-end gap-2.5">
          <SheetClose asChild>
            <Button variant="outline" className="px-3.5">
              {i18n.messages.common.cancel}
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>
              <i aria-hidden className="ri-add-line" />
              {labels.expenseForm.submit}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
