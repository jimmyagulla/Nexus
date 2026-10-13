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
    },
  ],
};

function renderView(
  model: ExpenseReportViewModel,
  onBack: () => void = () => undefined,
) {
  render(
    <ExpenseReportDetail
      report={model}
      categories={[{ id: 'restaurant', label: 'Restaurant' }]}
      errorPresenter={new ErrorPresenter()}
      addExpenseError={null}
      onAddExpense={async () => true}
      onBack={onBack}
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

  it('lets the employee add an expense to a draft', () => {
    renderView(report);

    expect(
      screen.getByRole('button', {
        name: i18n.messages.expenseReports.addExpense,
      }),
    ).toBeTruthy();
  });

  it('no longer lets the employee add an expense once the report is submitted', () => {
    renderView({ ...report, status: 'SUBMITTED', editable: false });

    expect(
      screen.queryByRole('button', {
        name: i18n.messages.expenseReports.addExpense,
      }),
    ).toBeNull();
  });

  it('goes back to the reports', () => {
    let backed = 0;
    renderView(report, () => {
      backed += 1;
    });

    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.expenseReports.back }),
    );

    expect(backed).toBe(1);
  });
});
