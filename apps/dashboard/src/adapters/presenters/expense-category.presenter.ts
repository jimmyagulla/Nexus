import { ExpenseCategorySnapshot } from '@hexagonal-monorepo-template/domain';

export interface ExpenseCategoryViewModel {
  id: string;
  label: string;
}

export class ExpenseCategoryPresenter {
  present(
    categories: readonly ExpenseCategorySnapshot[],
  ): ExpenseCategoryViewModel[] {
    return categories.map((category) => ({
      id: category.id,
      label: category.label,
    }));
  }
}
