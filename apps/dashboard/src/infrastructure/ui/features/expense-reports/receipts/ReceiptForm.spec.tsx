import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { ReceiptForm } from './ReceiptForm';
import type { ReceiptValues } from './receipt.schema';

function renderForm(
  options: { accepted?: boolean; submissionError?: string | null } = {},
) {
  const submitted: ReceiptValues[] = [];

  render(
    <ReceiptForm
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
    choose: (file: File) =>
      fireEvent.change(
        screen.getByLabelText(i18n.messages.expenseReports.receiptFile),
        { target: { files: [file] } },
      ),
    attach: () =>
      fireEvent.click(
        screen.getByRole('button', {
          name: i18n.messages.expenseReports.attachReceipt,
        }),
      ),
  };
}

const pdf = new File(['content'], 'ticket.pdf', { type: 'application/pdf' });

describe('ReceiptForm', () => {
  it('hands the chosen file to its caller', async () => {
    const { choose, attach, submitted } = renderForm();

    choose(pdf);
    attach();

    await waitFor(() => expect(submitted).toHaveLength(1));
    expect(submitted[0]?.file.name).toBe('ticket.pdf');
  });

  it('asks for the expected document when no file is chosen', async () => {
    const { attach, submitted } = renderForm();

    attach();

    expect(
      await screen.findByText(i18n.messages.errors.MISSING_DOCUMENT),
    ).toBeTruthy();
    expect(submitted).toEqual([]);
  });

  it('refuses a file of another format', async () => {
    const { choose, attach, submitted } = renderForm();

    choose(new File(['content'], 'notes.txt', { type: 'text/plain' }));
    attach();

    expect(
      await screen.findByText(i18n.messages.errors.INVALID_FILE),
    ).toBeTruthy();
    expect(submitted).toEqual([]);
  });

  it('shows the refusal its caller reports', () => {
    renderForm({ submissionError: i18n.messages.errors.INVALID_FILE });

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.INVALID_FILE,
    );
  });
});
