import { render, screen } from '@testing-library/react';
import type { ExpenseViewModel } from '../../../../../adapters/presenters/expense-report.presenter';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { ExpenseList } from './ExpenseList';

function expense(id: string, description: string): ExpenseViewModel {
  return {
    id,
    date: '05/10/2026',
    category: 'Restaurant',
    amount: '45 €',
    vat: null,
    paymentMethod: 'Carte',
    description,
    assignment: 'Client',
    fields: {
      date: '2026-10-05',
      categoryId: 'restaurant',
      amount: '45',
      vat: '',
      paymentMethod: 'Carte',
      description,
      assignment: 'Client',
    },
  };
}

function renderList(expenses: ExpenseViewModel[], editable = false) {
  render(
    <ExpenseList
      expenses={expenses}
      actions={
        editable
          ? {
              categories: [{ id: 'restaurant', label: 'Restaurant' }],
              errorPresenter: new ErrorPresenter(),
              editError: null,
              onEdit: async () => true,
              onRemove: () => undefined,
            }
          : undefined
      }
    />,
  );
}

describe('ExpenseList', () => {
  it('lists every expense', () => {
    renderList([expense('x1', 'Déjeuner'), expense('x2', 'Stationnement')]);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Stationnement')).toBeTruthy();
  });

  it('announces a report without expense', () => {
    renderList([]);

    expect(
      screen.getByText(i18n.messages.expenseReports.noExpenses),
    ).toBeTruthy();
  });

  it('offers to modify every expense of a draft', () => {
    renderList([expense('x1', 'Déjeuner'), expense('x2', 'Stationnement')], true);

    expect(
      screen.getAllByRole('button', {
        name: i18n.messages.expenseReports.editExpense,
      }),
    ).toHaveLength(2);
  });
});
