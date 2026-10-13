import { describe, expect, it } from 'vitest';
import { ExpenseCategoryPresenter } from './expense-category.presenter';

describe('ExpenseCategoryPresenter', () => {
  it('offers every category as an identity and a label', () => {
    expect(
      new ExpenseCategoryPresenter().present([
        { id: 'restaurant', label: 'Restaurant' },
        { id: 'cat-1', label: 'Hôtel' },
      ]),
    ).toEqual([
      { id: 'restaurant', label: 'Restaurant' },
      { id: 'cat-1', label: 'Hôtel' },
    ]);
  });

  it('offers nothing when there is no category', () => {
    expect(new ExpenseCategoryPresenter().present([])).toEqual([]);
  });
});
