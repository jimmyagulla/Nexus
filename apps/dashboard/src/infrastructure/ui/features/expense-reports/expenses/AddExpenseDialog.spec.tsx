import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { AddExpenseDialog } from './AddExpenseDialog';
import type { ExpenseValues } from './expense.schema';

const labels = i18n.messages.expenseReports.expense;

function renderDialog(
  options: { accepted?: boolean; submissionError?: string | null } = {},
) {
  const submitted: ExpenseValues[] = [];

  render(
    <AddExpenseDialog
      categories={[{ id: 'restaurant', label: 'Restaurant' }]}
      errorPresenter={new ErrorPresenter()}
      submissionError={options.submissionError ?? null}
      onSubmit={async (values) => {
        submitted.push(values);
        return options.accepted ?? true;
      }}
    />,
  );

  return {
    submitted,
    open: () =>
      fireEvent.click(
        screen.getByRole('button', {
          name: i18n.messages.expenseReports.addExpense,
        }),
      ),
    fillAndConfirm: () => {
      const dialog = within(screen.getByRole('dialog'));
      const type = (label: string, value: string) =>
        fireEvent.change(dialog.getByLabelText(label), { target: { value } });
      type(labels.date, '2026-10-05');
      type(labels.category, 'restaurant');
      type(labels.amount, '45');
      type(labels.paymentMethod, 'Carte');
      type(labels.description, 'Déjeuner client');
      type(labels.assignment, 'Client Dupont');
      fireEvent.click(
        dialog.getByRole('button', {
          name: i18n.messages.expenseReports.addExpense,
        }),
      );
    },
  };
}

describe('AddExpenseDialog', () => {
  it('keeps the form out of the way until the user asks for it', () => {
    renderDialog();

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('shows the form once the user asks to add an expense', () => {
    const { open } = renderDialog();

    open();

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(
      screen.getByText(i18n.messages.expenseReports.addExpenseTitle),
    ).toBeTruthy();
  });

  it('closes itself once the expense is added', async () => {
    const { open, fillAndConfirm, submitted } = renderDialog();

    open();
    fillAndConfirm();

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(submitted).toHaveLength(1);
  });

  it('stays open when the api refuses the expense', async () => {
    const { open, fillAndConfirm, submitted } = renderDialog({
      accepted: false,
    });

    open();
    fillAndConfirm();

    await waitFor(() => expect(submitted).toHaveLength(1));
    expect(screen.queryByRole('dialog')).toBeTruthy();
  });

  it('shows the refusal its caller reports', () => {
    const { open } = renderDialog({
      submissionError: i18n.messages.errors.INVALID_AMOUNT,
    });

    open();

    expect(within(screen.getByRole('dialog')).getByRole('alert').textContent).toBe(
      i18n.messages.errors.INVALID_AMOUNT,
    );
  });
});
