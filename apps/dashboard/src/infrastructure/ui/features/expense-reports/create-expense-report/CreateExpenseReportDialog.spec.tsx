import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { CreateExpenseReportDialog } from './CreateExpenseReportDialog';
import type { CreateExpenseReportValues } from './create-expense-report.schema';

function renderDialog(
  options: { accepted?: boolean; submissionError?: string | null } = {},
) {
  const submitted: CreateExpenseReportValues[] = [];

  render(
    <CreateExpenseReportDialog
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
          name: i18n.messages.expenseReports.create,
        }),
      ),
    fillAndConfirm: () => {
      const dialog = within(screen.getByRole('dialog'));
      fireEvent.change(dialog.getByLabelText(i18n.messages.expenseReports.label), {
        target: { value: 'Déplacement Lyon' },
      });
      fireEvent.click(
        dialog.getByRole('button', {
          name: i18n.messages.expenseReports.create,
        }),
      );
    },
  };
}

describe('CreateExpenseReportDialog', () => {
  it('keeps the form out of the way until the user asks for it', () => {
    renderDialog();

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('shows the form once the user asks to create a report', () => {
    const { open } = renderDialog();

    open();

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(
      screen.getByText(i18n.messages.expenseReports.createTitle),
    ).toBeTruthy();
  });

  it('closes itself once the report is created', async () => {
    const { open, fillAndConfirm, submitted } = renderDialog();

    open();
    fillAndConfirm();

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(submitted).toEqual([{ label: 'Déplacement Lyon' }]);
  });

  it('stays open when the api refuses the report', async () => {
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
      submissionError: i18n.messages.errors.INACTIVE_EMPLOYEE,
    });

    open();

    expect(within(screen.getByRole('dialog')).getByRole('alert').textContent).toBe(
      i18n.messages.errors.INACTIVE_EMPLOYEE,
    );
  });
});
