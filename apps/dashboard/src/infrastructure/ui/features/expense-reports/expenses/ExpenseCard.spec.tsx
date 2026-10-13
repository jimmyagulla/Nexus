import { render, screen } from '@testing-library/react';
import { ExpenseCard } from './ExpenseCard';

describe('ExpenseCard', () => {
  it('shows what the expense is about', () => {
    render(
      <ul>
        <ExpenseCard
          expense={{
            id: 'x1',
            date: '05/10/2026',
            category: 'Restaurant',
            amount: '45 €',
            vat: null,
            paymentMethod: 'Carte',
            description: 'Déjeuner client',
            assignment: 'Client Dupont',
          }}
        />
      </ul>,
    );

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
});
