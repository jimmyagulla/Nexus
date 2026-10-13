import type { ExpenseCategoryViewModel } from '../../../../adapters/presenters/expense-category.presenter';

interface ExpenseCategoryCardProps {
  category: ExpenseCategoryViewModel;
}

export function ExpenseCategoryCard({ category }: ExpenseCategoryCardProps) {
  return <li className="py-1">{category.label}</li>;
}
