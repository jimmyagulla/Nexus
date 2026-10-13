import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { AttachReceiptDialog } from './AttachReceiptDialog';
import type { ReceiptValues } from './receipt.schema';

function renderDialog(
  options: { accepted?: boolean; submissionError?: string | null } = {},
) {
  const submitted: ReceiptValues[] = [];

  render(
    <AttachReceiptDialog
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
          name: i18n.messages.expenseReports.attachReceipt,
        }),
      ),
    chooseAndConfirm: () => {
      const dialog = within(screen.getByRole('dialog'));
      fireEvent.change(
        dialog.getByLabelText(i18n.messages.expenseReports.receiptFile),
        {
          target: {
            files: [
              new File(['content'], 'ticket.pdf', { type: 'application/pdf' }),
            ],
          },
        },
      );
      fireEvent.click(
        dialog.getByRole('button', {
          name: i18n.messages.expenseReports.attachReceipt,
        }),
      );
    },
  };
}

describe('AttachReceiptDialog', () => {
  it('keeps the form out of the way until the user asks for it', () => {
    renderDialog();

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('shows the form once the user asks to add a receipt', () => {
    const { open } = renderDialog();

    open();

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(
      screen.getByText(i18n.messages.expenseReports.attachReceiptTitle),
    ).toBeTruthy();
  });

  it('closes itself once the receipt is attached', async () => {
    const { open, chooseAndConfirm, submitted } = renderDialog();

    open();
    chooseAndConfirm();

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(submitted).toHaveLength(1);
  });

  it('stays open when the api refuses the receipt', async () => {
    const { open, chooseAndConfirm, submitted } = renderDialog({
      accepted: false,
    });

    open();
    chooseAndConfirm();

    await waitFor(() => expect(submitted).toHaveLength(1));
    expect(screen.queryByRole('dialog')).toBeTruthy();
  });

  it('shows the refusal its caller reports', () => {
    const { open } = renderDialog({
      submissionError: i18n.messages.errors.INVALID_FILE,
    });

    open();

    expect(within(screen.getByRole('dialog')).getByRole('alert').textContent).toBe(
      i18n.messages.errors.INVALID_FILE,
    );
  });
});
