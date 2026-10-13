import { render, screen } from '@testing-library/react';
import { ExpenseCategoryList } from './ExpenseCategoryList';

describe('ExpenseCategoryList', () => {
  it('lists every category by its label', () => {
    render(
      <ExpenseCategoryList
        categories={[
          { id: 'restaurant', label: 'Restaurant' },
          { id: 'cat-1', label: 'Hôtel' },
        ]}
      />,
    );

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(
      ['Restaurant', 'Hôtel'],
    );
  });
});
