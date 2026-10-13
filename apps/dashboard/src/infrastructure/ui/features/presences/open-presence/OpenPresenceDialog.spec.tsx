import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { OpenPresenceDialog } from './OpenPresenceDialog';
import type { OpenPresenceValues } from './open-presence.schema';

function renderDialog(
  options: { opened?: boolean; submissionError?: string | null } = {},
) {
  const opened = options.opened ?? true;
  const submitted: OpenPresenceValues[] = [];

  render(
    <OpenPresenceDialog
      employees={[{ value: 'e1', label: 'Camille Martin' }]}
      errorPresenter={new ErrorPresenter()}
      submissionError={options.submissionError ?? null}
      onSubmit={async (values) => {
        submitted.push(values);
        return opened;
      }}
    />,
  );

  return {
    submitted,
    openDialog: () =>
      fireEvent.click(
        screen.getByRole('button', { name: i18n.messages.presences.openMonth }),
      ),
    fillAndSubmit: () => {
      const dialog = within(screen.getByRole('dialog'));
      fireEvent.keyDown(
        dialog.getByRole('combobox', {
          name: i18n.messages.presences.employee,
        }),
        { key: 'Enter' },
      );
      fireEvent.click(screen.getByRole('option', { name: 'Camille Martin' }));
      fireEvent.change(dialog.getByLabelText(i18n.messages.presences.month), {
        target: { value: '2026-10' },
      });
      fireEvent.click(
        dialog.getByRole('button', { name: i18n.messages.presences.open }),
      );
    },
  };
}

describe('OpenPresenceDialog', () => {
  it('keeps the form out of the way until the user asks for it', () => {
    renderDialog();

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByLabelText(i18n.messages.presences.month)).toBeNull();
  });

  it('offers to open a month', () => {
    renderDialog();

    expect(
      screen.getByRole('button', { name: i18n.messages.presences.openMonth }),
    ).toBeTruthy();
  });

  it('shows the form once the user asks to open a month', () => {
    const { openDialog } = renderDialog();

    openDialog();

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByLabelText(i18n.messages.presences.month)).toBeTruthy();
  });

  it('names what the form is for', () => {
    const { openDialog } = renderDialog();

    openDialog();

    expect(
      screen.getByRole('heading', {
        name: i18n.messages.presences.openMonthTitle,
      }),
    ).toBeTruthy();
  });

  it('closes the dialog once the month is open', async () => {
    const { openDialog, fillAndSubmit, submitted } = renderDialog();

    openDialog();
    fillAndSubmit();

    await waitFor(() => expect(submitted).toHaveLength(1));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('keeps the dialog open when the month is refused', async () => {
    const { openDialog, fillAndSubmit, submitted } = renderDialog({
      opened: false,
    });

    openDialog();
    fillAndSubmit();

    await waitFor(() => expect(submitted).toHaveLength(1));
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('explains inside the dialog why the month was refused', () => {
    const { openDialog } = renderDialog({
      submissionError: i18n.messages.errors.POTENTIAL_DUPLICATE,
    });

    openDialog();

    expect(within(screen.getByRole('dialog')).getByRole('alert').textContent).toBe(
      i18n.messages.errors.POTENTIAL_DUPLICATE,
    );
  });
});
