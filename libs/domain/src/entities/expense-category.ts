import { ErrorCode } from '../errors/error-code';

export class ExpenseCategory {
  constructor(
    readonly id: string,
    readonly companyId: string,
    readonly label: string,
  ) {}
}

export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'parking', label: 'Parking' },
  { id: 'train', label: 'Train' },
  { id: 'other', label: 'Autre' },
] as const;

export function expenseCategoriesOf(
  companyId: string,
  added: readonly ExpenseCategory[],
): readonly ExpenseCategory[] {
  return [
    ...DEFAULT_EXPENSE_CATEGORIES.map(
      (category) => new ExpenseCategory(category.id, companyId, category.label),
    ),
    ...added,
  ];
}

export function requireExpenseCategoryLabel(raw: string): string {
  const label = raw.trim();
  if (label === '') {
    throw new Error(ErrorCode.REQUIRED_INFORMATION);
  }
  return label;
}
