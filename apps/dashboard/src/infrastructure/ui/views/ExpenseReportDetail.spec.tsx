import { fireEvent, render, screen } from '@testing-library/react';
import type { ExpenseReportViewModel } from '../../../adapters/presenters/expense-report.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { i18n } from '../i18n/i18n';
import { ExpenseReportDetail } from './ExpenseReportDetail';

const report: ExpenseReportViewModel = {
  id: 'r1',
  label: 'Déplacement Lyon',
  status: 'DRAFT',
  statusLabel: 'Brouillon',
  editable: true,
  total: '125 €',
  expenses: [
    {
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
    },
  ],
};

function renderView(
  model: ExpenseReportViewModel,
  options: {
    onBack?: () => void;
    onRemove?: (id: string) => void;
    removeError?: string | null;
  } = {},
) {
  render(
    <ExpenseReportDetail
      report={model}
      categories={[{ id: 'restaurant', label: 'Restaurant' }]}
      errorPresenter={new ErrorPresenter()}
      addExpenseError={null}
      editExpenseError={null}
      removeExpenseError={options.removeError ?? null}
      onAddExpense={async () => true}
      onEditExpense={async () => true}
      onRemoveExpense={options.onRemove ?? (() => undefined)}
      onBack={options.onBack ?? (() => undefined)}
    />,
  );
}

describe('ExpenseReportDetail', () => {
  it('shows the label and the status of the report', () => {
    renderView(report);

    expect(
      screen.getByRole('heading', { name: 'Déplacement Lyon' }),
    ).toBeTruthy();
    expect(screen.getByText('Brouillon')).toBeTruthy();
  });

  it('lists the expenses of the report', () => {
    renderView(report);

    expect(screen.getByText('Déjeuner client')).toBeTruthy();
  });

  it('shows the total of the report', () => {
    renderView(report);

    expect(
      screen.getByText(`${i18n.messages.expenseReports.total} : 125 €`),
    ).toBeTruthy();
  });

  it('lets the employee add, modify and remove expenses of a draft', () => {
    renderView(report);

    for (const name of [
      i18n.messages.expenseReports.addExpense,
      i18n.messages.expenseReports.editExpense,
      i18n.messages.expenseReports.removeExpense,
    ]) {
      expect(screen.getByRole('button', { name })).toBeTruthy();
    }
  });

  it('no longer lets the employee change the expenses once the report is submitted', () => {
    renderView({ ...report, status: 'SUBMITTED', editable: false });

    for (const name of [
      i18n.messages.expenseReports.addExpense,
      i18n.messages.expenseReports.editExpense,
      i18n.messages.expenseReports.removeExpense,
    ]) {
      expect(screen.queryByRole('button', { name })).toBeNull();
    }
  });

  it('removes the expense on demand', () => {
    const removed: string[] = [];
    renderView(report, { onRemove: (id) => removed.push(id) });

    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.messages.expenseReports.removeExpense,
      }),
    );

    expect(removed).toEqual(['x1']);
  });

  it('explains why an expense could not be removed', () => {
    renderView(report, { removeError: i18n.messages.errors.ACCESS_DENIED });

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.ACCESS_DENIED,
    );
  });

  it('goes back to the reports', () => {
    let backed = 0;
    renderView(report, {
      onBack: () => {
        backed += 1;
      },
    });

    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.expenseReports.back }),
    );

    expect(backed).toBe(1);
  });
});
