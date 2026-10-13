import { fireEvent, render, screen } from '@testing-library/react';
import type { ExpenseReportViewModel } from '../../../adapters/presenters/expense-report.presenter';
import { i18n } from '../i18n/i18n';
import { EmployerExpenseReport } from './EmployerExpenseReport';

const names = i18n.messages.expenseReports;

const report: ExpenseReportViewModel = {
  id: 'r1',
  label: 'Déplacement Lyon',
  status: 'UNDER_REVIEW',
  statusLabel: 'En cours de validation',
  editable: false,
  requestable: true,
  decidable: true,
  total: '125 €',
  receipts: [{ id: 'f1', fileName: 'ticket.pdf', size: '2 Ko' }],
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
    calls?: string[];
    actionError?: string | null;
    openReceiptError?: string | null;
  } = {},
) {
  const calls = options.calls ?? [];
  render(
    <EmployerExpenseReport
      report={model}
      actionError={options.actionError ?? null}
      openReceiptError={options.openReceiptError ?? null}
      onRequestInformation={() => calls.push('information')}
      onValidate={() => calls.push('validate')}
      onRefuse={() => calls.push('refuse')}
      onOpenReceipt={(id) => calls.push(`receipt:${id}`)}
      onBack={() => calls.push('back')}
    />,
  );
}

describe('EmployerExpenseReport', () => {
  it('shows the label, the status, the expenses and the total', () => {
    renderView(report);

    expect(
      screen.getByRole('heading', { name: 'Déplacement Lyon' }),
    ).toBeTruthy();
    expect(screen.getByText('En cours de validation')).toBeTruthy();
    expect(screen.getByText('Déjeuner client')).toBeTruthy();
    expect(screen.getByText(`${names.total} : 125 €`)).toBeTruthy();
  });

  it('lets the employer open the receipts', () => {
    const calls: string[] = [];
    renderView(report, { calls });

    expect(screen.getByText('ticket.pdf')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: names.openReceipt }));

    expect(calls).toEqual(['receipt:f1']);
  });

  it('does not let the employer touch the expenses', () => {
    renderView(report);

    expect(screen.queryByRole('button', { name: names.editExpense })).toBeNull();
    expect(
      screen.queryByRole('button', { name: names.removeExpense }),
    ).toBeNull();
    expect(screen.queryByRole('button', { name: names.addExpense })).toBeNull();
  });

  it('offers to ask for information, to validate and to refuse while under review', () => {
    const calls: string[] = [];
    renderView(report, { calls });

    fireEvent.click(
      screen.getByRole('button', { name: names.requestInformation }),
    );
    fireEvent.click(screen.getByRole('button', { name: names.validate }));
    fireEvent.click(screen.getByRole('button', { name: names.refuse }));

    expect(calls).toEqual(['information', 'validate', 'refuse']);
  });

  it('offers no decision once the report is processed', () => {
    renderView({
      ...report,
      status: 'VALIDATED',
      statusLabel: 'Validée',
      requestable: false,
      decidable: false,
    });

    expect(screen.queryByRole('button', { name: names.validate })).toBeNull();
    expect(screen.queryByRole('button', { name: names.refuse })).toBeNull();
  });

  it('explains why an action was refused', () => {
    renderView(report, {
      actionError: i18n.messages.errors.REQUEST_ALREADY_PROCESSED,
    });

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.REQUEST_ALREADY_PROCESSED,
    );
  });

  it('goes back to the reports', () => {
    const calls: string[] = [];
    renderView(report, { calls });

    fireEvent.click(screen.getByRole('button', { name: names.back }));

    expect(calls).toEqual(['back']);
  });
});
