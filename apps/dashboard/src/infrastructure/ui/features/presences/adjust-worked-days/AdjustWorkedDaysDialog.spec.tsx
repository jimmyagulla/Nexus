import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { AdjustWorkedDaysDialog } from './AdjustWorkedDaysDialog';
import type { AdjustWorkedDaysValues } from './adjust-worked-days.schema';

function renderDialog(
  options: { accepted?: boolean; submissionError?: string | null } = {},
) {
  const accepted = options.accepted ?? true;
  const submitted: AdjustWorkedDaysValues[] = [];

  render(
    <AdjustWorkedDaysDialog
      workedDays={22}
      errorPresenter={new ErrorPresenter()}
      submissionError={options.submissionError ?? null}
      onSubmit={async (values) => {
        submitted.push(values);
        return accepted;
      }}
    />,
  );

  return {
    submitted,
    openDialog: () =>
      fireEvent.click(
        screen.getByRole('button', { name: i18n.messages.presences.adjust }),
      ),
    correctAndSave: () => {
      const dialog = within(screen.getByRole('dialog'));
      fireEvent.change(
        dialog.getByLabelText(i18n.messages.presences.workedDays),
        { target: { value: '20' } },
      );
      fireEvent.click(
        dialog.getByRole('button', { name: i18n.messages.presences.save }),
      );
    },
  };
}

describe('AdjustWorkedDaysDialog', () => {
  it('keeps the form out of the way until the user asks for it', () => {
    renderDialog();

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('offers to adjust the days', () => {
    renderDialog();

    expect(
      screen.getByRole('button', { name: i18n.messages.presences.adjust }),
    ).toBeTruthy();
  });

  it('names what the form is for', () => {
    const { openDialog } = renderDialog();

    openDialog();

    expect(
      screen.getByRole('heading', { name: i18n.messages.presences.adjustTitle }),
    ).toBeTruthy();
  });

  it('starts on the days the month holds today', () => {
    const { openDialog } = renderDialog();

    openDialog();

    expect(
      screen.getByLabelText<HTMLInputElement>(i18n.messages.presences.workedDays)
        .value,
    ).toBe('22');
  });

  it('closes the dialog once the days are corrected', async () => {
    const { openDialog, correctAndSave, submitted } = renderDialog();

    openDialog();
    correctAndSave();

    await waitFor(() => expect(submitted).toEqual([{ workedDays: 20 }]));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('keeps the dialog open when the correction is refused', async () => {
    const { openDialog, correctAndSave, submitted } = renderDialog({
      accepted: false,
    });

    openDialog();
    correctAndSave();

    await waitFor(() => expect(submitted).toHaveLength(1));
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('explains inside the dialog why the correction was refused', () => {
    const { openDialog } = renderDialog({
      submissionError: i18n.messages.errors.ACCESS_DENIED,
    });

    openDialog();

    expect(within(screen.getByRole('dialog')).getByRole('alert').textContent).toBe(
      i18n.messages.errors.ACCESS_DENIED,
    );
  });
});
