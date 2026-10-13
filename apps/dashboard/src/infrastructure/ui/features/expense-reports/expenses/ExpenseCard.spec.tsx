import { fireEvent, render, screen } from '@testing-library/react';
import type { ExpenseViewModel } from '../../../../../adapters/presenters/expense-report.presenter';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { ExpenseCard } from './ExpenseCard';

const expense: ExpenseViewModel = {
  id: 'x1',
  date: '05/10/2026',
  category: 'Restaurant',
  amount: '45 €',
  vat: null,
  paymentMethod: 'Carte',
  description: 'Déjeuner client',
  assignment: 'Client Dupont',
  fields: {
    date: '2026-10-05',
    categoryId: 'restaurant',
    amount: '45',
    vat: '',
    paymentMethod: 'Carte',
    description: 'Déjeuner client',
    assignment: 'Client Dupont',
  },
};

function renderCard(editable: boolean, removed: string[] = []) {
  render(
    <ul>
      <ExpenseCard
        expense={expense}
        editable={editable}
        categories={[{ id: 'restaurant', label: 'Restaurant' }]}
        errorPresenter={new ErrorPresenter()}
        editError={null}
        onEdit={async () => true}
        onRemove={(id) => removed.push(id)}
      />
    </ul>,
  );
}

describe('ExpenseCard', () => {
  it('shows what the expense is about', () => {
    renderCard(false);

    for (const text of [
      '05/10/2026',
      'Restaurant',
      '45 €',
      'Déjeuner client',
      'Client Dupont',
    ]) {
      expect(screen.getByText(text)).toBeTruthy();
    }
  });

  it('offers to modify and to remove the expense of a draft', () => {
    renderCard(true);

    expect(
      screen.getByRole('button', {
        name: i18n.messages.expenseReports.editExpense,
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', {
        name: i18n.messages.expenseReports.removeExpense,
      }),
    ).toBeTruthy();
  });

  it('offers no action once the report is no longer a draft', () => {
    renderCard(false);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('removes the expense on demand', () => {
    const removed: string[] = [];
    renderCard(true, removed);

    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.messages.expenseReports.removeExpense,
      }),
    );

    expect(removed).toEqual(['x1']);
  });
});
