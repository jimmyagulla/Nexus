import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { EditExpenseDialog } from './EditExpenseDialog';
import type { ExpenseValues } from './expense.schema';

const labels = i18n.messages.expenseReports.expense;

function renderDialog(
  options: { saved?: boolean; submissionError?: string | null } = {},
) {
  const submitted: ExpenseValues[] = [];

  render(
    <EditExpenseDialog
      fields={{
        date: '2026-10-05',
        categoryId: 'restaurant',
        amount: '45',
        vat: '',
        paymentMethod: 'Carte',
        description: 'Déjeuner',
        assignment: 'Client Dupont',
      }}
      categories={[{ id: 'restaurant', label: 'Restaurant' }]}
      errorPresenter={new ErrorPresenter()}
      submissionError={options.submissionError ?? null}
      onSubmit={async (values) => {
        submitted.push(values);
        return options.saved ?? true;
      }}
    />,
  );

  return {
    submitted,
    open: () =>
      fireEvent.click(
        screen.getByRole('button', {
          name: i18n.messages.expenseReports.editExpense,
        }),
      ),
    saveWithAmount: (amount: string) => {
      const dialog = within(screen.getByRole('dialog'));
      fireEvent.change(dialog.getByLabelText(labels.amount), {
        target: { value: amount },
      });
      fireEvent.click(
        dialog.getByRole('button', {
          name: i18n.messages.expenseReports.saveExpense,
        }),
      );
    },
  };
}

describe('EditExpenseDialog', () => {
  it('keeps the form out of the way until the user asks for it', () => {
    renderDialog();

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('shows the form filled with the current expense', () => {
    const { open } = renderDialog();

    open();

    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByLabelText<HTMLInputElement>(labels.amount).value).toBe(
      '45',
    );
    expect(
      dialog.getByLabelText<HTMLInputElement>(labels.description).value,
    ).toBe('Déjeuner');
    expect(
      screen.getByText(i18n.messages.expenseReports.editExpenseTitle),
    ).toBeTruthy();
  });

  it('hands the modified expense to its caller and closes itself', async () => {
    const { open, saveWithAmount, submitted } = renderDialog();

    open();
    saveWithAmount('50');

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(submitted[0]).toMatchObject({ amount: 50, categoryId: 'restaurant' });
  });

  it('stays open when the api refuses the modification', async () => {
    const { open, saveWithAmount, submitted } = renderDialog({ saved: false });

    open();
    saveWithAmount('50');

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
