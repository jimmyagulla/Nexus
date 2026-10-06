import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { fr } from '../../i18n/fr';
import { AddPublicHolidayDialog } from './AddPublicHolidayDialog';
import type { PublicHolidayValues } from './public-holiday.schema';

function renderDialog(
  options: { retained?: boolean; submissionError?: string | null } = {},
) {
  const retained = options.retained ?? true;
  const submitted: PublicHolidayValues[] = [];

  render(
    <AddPublicHolidayDialog
      errorPresenter={new ErrorPresenter()}
      submissionError={options.submissionError ?? null}
      onSubmit={async (values) => {
        submitted.push(values);
        return retained;
      }}
    />,
  );

  return {
    submitted,
    open: () =>
      fireEvent.click(
        screen.getByRole('button', { name: fr.settings.addHoliday }),
      ),
    fill: (values: PublicHolidayValues) => {
      fireEvent.change(screen.getByLabelText(fr.settings.date), {
        target: { value: values.date },
      });
      fireEvent.change(screen.getByLabelText(fr.settings.label), {
        target: { value: values.label },
      });
    },
    confirm: () =>
      fireEvent.click(
        within(screen.getByRole('dialog')).getByRole('button', {
          name: fr.settings.addHoliday,
        }),
      ),
  };
}

describe('AddPublicHolidayDialog', () => {
  it('keeps the form out of the way until the user asks for it', () => {
    renderDialog();

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByLabelText(fr.settings.date)).toBeNull();
  });

  it('offers to add a public holiday', () => {
    renderDialog();

    expect(
      screen.getByRole('button', { name: fr.settings.addHoliday }),
    ).toBeTruthy();
  });

  it('shows the form once the user asks to add a public holiday', () => {
    const { open } = renderDialog();

    open();

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByLabelText(fr.settings.date)).toBeTruthy();
    expect(screen.getByLabelText(fr.settings.label)).toBeTruthy();
  });

  it('names what the form is for', () => {
    const { open } = renderDialog();

    open();

    expect(screen.getByText(fr.settings.addHolidayTitle)).toBeTruthy();
  });

  it('hands the entered public holiday to its caller', async () => {
    const { open, fill, confirm, submitted } = renderDialog();

    open();
    fill({ date: '2026-07-14', label: 'Fête nationale' });
    confirm();

    await waitFor(() =>
      expect(submitted).toEqual([
        { date: '2026-07-14', label: 'Fête nationale' },
      ]),
    );
  });

  it('closes itself once the public holiday is added', async () => {
    const { open, fill, confirm } = renderDialog();

    open();
    fill({ date: '2026-07-14', label: 'Fête nationale' });
    confirm();

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('stays open when the api refuses the public holiday', async () => {
    const { open, fill, confirm, submitted } = renderDialog({
      retained: false,
    });

    open();
    fill({ date: '2026-07-14', label: 'Fête nationale' });
    confirm();

    await waitFor(() =>
      expect(submitted).toEqual([
        { date: '2026-07-14', label: 'Fête nationale' },
      ]),
    );
    expect(screen.queryByRole('dialog')).toBeTruthy();
  });

  it('shows the refusal its caller reports without closing', () => {
    const { open } = renderDialog({
      submissionError: fr.errors.POTENTIAL_DUPLICATE,
    });

    open();

    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByRole('alert').textContent).toBe(
      fr.errors.POTENTIAL_DUPLICATE,
    );
  });

  it('stays open while the public holiday is refused', async () => {
    const { open, fill, confirm, submitted } = renderDialog();

    open();
    fill({ date: '', label: 'Fête nationale' });
    confirm();

    await screen.findByText(fr.errors.REQUIRED_INFORMATION);
    expect(screen.queryByRole('dialog')).toBeTruthy();
    expect(submitted).toEqual([]);
  });
});
