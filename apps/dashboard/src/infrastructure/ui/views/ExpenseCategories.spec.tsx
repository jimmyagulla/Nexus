import { render, screen } from '@testing-library/react';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { i18n } from '../i18n/i18n';
import { ExpenseCategories } from './ExpenseCategories';

describe('ExpenseCategories', () => {
  it('titles the section and lists the categories', () => {
    render(
      <ExpenseCategories
        categories={[
          { id: 'restaurant', label: 'Restaurant' },
          { id: 'cat-1', label: 'Hôtel' },
        ]}
        errorPresenter={new ErrorPresenter()}
        addError={null}
        onAdd={async () => true}
      />,
    );

    expect(
      screen.getByRole('heading', {
        name: i18n.messages.expenseCategories.title,
      }),
    ).toBeTruthy();
    expect(screen.getByText('Hôtel')).toBeTruthy();
  });

  it('offers to add a category', () => {
    render(
      <ExpenseCategories
        categories={[]}
        errorPresenter={new ErrorPresenter()}
        addError={null}
        onAdd={async () => true}
      />,
    );

    expect(
      screen.getByRole('button', { name: i18n.messages.expenseCategories.add }),
    ).toBeTruthy();
  });
});
