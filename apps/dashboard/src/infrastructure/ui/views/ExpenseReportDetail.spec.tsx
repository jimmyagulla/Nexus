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
    onBack?: () => void;
    onRemove?: (id: string) => void;
    removeError?: string | null;
    submitError?: string | null;
    confirmation?: string | null;
    onOpenReceipt?: (id: string) => void;
    openReceiptError?: string | null;
    onSubmit?: () => void;
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
      attachReceiptError={null}
      submitError={options.submitError ?? null}
      openReceiptError={options.openReceiptError ?? null}
      confirmation={options.confirmation ?? null}
      onOpenReceipt={options.onOpenReceipt ?? (() => undefined)}
      onAttachReceipt={async () => true}
      onSubmit={options.onSubmit ?? (() => undefined)}
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

  it('lists the receipts of the report', () => {
    renderView(report);

    expect(
      screen.getByRole('heading', {
        name: i18n.messages.expenseReports.receiptsTitle,
      }),
    ).toBeTruthy();
    expect(screen.getByText('ticket.pdf')).toBeTruthy();
  });

  it('announces a draft without any receipt', () => {
    renderView({ ...report, receipts: [] });

    expect(
      screen.getByText(i18n.messages.expenseReports.noReceipts),
    ).toBeTruthy();
  });

  it('lets the employee add a receipt and submit a draft', () => {
    renderView(report);

    expect(
      screen.getByRole('button', {
        name: i18n.messages.expenseReports.attachReceipt,
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: i18n.messages.expenseReports.submit }),
    ).toBeTruthy();
  });

  it('no longer lets the employee add a receipt or submit once submitted', () => {
    renderView({ ...report, status: 'SUBMITTED', editable: false });

    expect(
      screen.queryByRole('button', {
        name: i18n.messages.expenseReports.attachReceipt,
      }),
    ).toBeNull();
    expect(
      screen.queryByRole('button', {
        name: i18n.messages.expenseReports.submit,
      }),
    ).toBeNull();
  });

  it('submits the report on demand', () => {
    let submitted = 0;
    renderView(report, {
      onSubmit: () => {
        submitted += 1;
      },
    });

    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.expenseReports.submit }),
    );

    expect(submitted).toBe(1);
  });

  it('explains why the report could not be submitted', () => {
    renderView(report, { submitError: i18n.messages.errors.MISSING_DOCUMENT });

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.MISSING_DOCUMENT,
    );
  });

  it('confirms the submission with the expected phrase', () => {
    renderView(
      { ...report, status: 'SUBMITTED', editable: false },
      { confirmation: i18n.messages.expenseReports.submitted },
    );

    expect(screen.getByRole('status').textContent).toBe(
      'Votre note de frais a été soumise.',
    );
  });

  it('confirms nothing until something happened', () => {
    renderView(report);

    expect(screen.queryByRole('status')).toBeNull();
  });

  it('opens a receipt on demand', () => {
    const opened: string[] = [];
    renderView(report, { onOpenReceipt: (id) => opened.push(id) });

    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.messages.expenseReports.openReceipt,
      }),
    );

    expect(opened).toEqual(['f1']);
  });

  it('explains why a receipt could not be opened', () => {
    renderView(report, {
      openReceiptError: i18n.messages.errors.ACCESS_DENIED,
    });

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
