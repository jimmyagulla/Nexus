import { render, screen } from '@testing-library/react';
import type { ExpenseViewModel } from '../../../../../adapters/presenters/expense-report.presenter';
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
  };
}

describe('ExpenseList', () => {
  it('lists every expense', () => {
    render(
      <ExpenseList
        expenses={[expense('x1', 'Déjeuner'), expense('x2', 'Stationnement')]}
      />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Stationnement')).toBeTruthy();
  });

  it('announces a report without expense', () => {
    render(<ExpenseList expenses={[]} />);

    expect(
      screen.getByText(i18n.messages.expenseReports.noExpenses),
    ).toBeTruthy();
  });
});
