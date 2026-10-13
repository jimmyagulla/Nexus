import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { i18n } from '../../i18n/i18n';
import { AddExpenseCategoryDialog } from './AddExpenseCategoryDialog';
import type { ExpenseCategoryValues } from './expense-category.schema';

function renderDialog(
  options: { accepted?: boolean; submissionError?: string | null } = {},
) {
  const submitted: ExpenseCategoryValues[] = [];

  render(
    <AddExpenseCategoryDialog
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
        screen.getByRole('button', { name: i18n.messages.expenseCategories.add }),
      ),
    fillAndConfirm: () => {
      const dialog = within(screen.getByRole('dialog'));
      fireEvent.change(
        dialog.getByLabelText(i18n.messages.expenseCategories.label),
        { target: { value: 'Hôtel' } },
      );
      fireEvent.click(
        dialog.getByRole('button', { name: i18n.messages.expenseCategories.add }),
      );
    },
  };
}

describe('AddExpenseCategoryDialog', () => {
  it('keeps the form out of the way until the user asks for it', () => {
    renderDialog();

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes itself once the category is added', async () => {
    const { open, fillAndConfirm, submitted } = renderDialog();

    open();
    fillAndConfirm();

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(submitted).toEqual([{ label: 'Hôtel' }]);
  });

  it('stays open when the api refuses the category', async () => {
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
      submissionError: i18n.messages.errors.POTENTIAL_DUPLICATE,
    });

    open();

    expect(within(screen.getByRole('dialog')).getByRole('alert').textContent).toBe(
      i18n.messages.errors.POTENTIAL_DUPLICATE,
    );
  });
});
