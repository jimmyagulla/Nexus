import type { ExpenseViewModel } from '../../../../../adapters/presenters/expense-report.presenter';

interface ExpenseCardProps {
  expense: ExpenseViewModel;
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
  return (
    <li className="flex flex-wrap items-center gap-4 py-2">
      <span>{expense.date}</span>
      <span>{expense.category}</span>
      <span className="font-semibold">{expense.amount}</span>
      <span>{expense.description}</span>
      <span className="text-muted-foreground">{expense.assignment}</span>
    </li>
  );
}
