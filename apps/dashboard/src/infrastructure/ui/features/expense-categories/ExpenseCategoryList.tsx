import type { ExpenseCategoryViewModel } from '../../../../adapters/presenters/expense-category.presenter';
import { ExpenseCategoryCard } from './ExpenseCategoryCard';

interface ExpenseCategoryListProps {
  categories: ExpenseCategoryViewModel[];
}

export function ExpenseCategoryList({ categories }: ExpenseCategoryListProps) {
  return (
    <ul>
      {categories.map((category) => (
        <ExpenseCategoryCard key={category.id} category={category} />
      ))}
    </ul>
  );
}
