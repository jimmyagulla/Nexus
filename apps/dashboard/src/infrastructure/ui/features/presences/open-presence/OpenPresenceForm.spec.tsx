import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { OpenPresenceForm } from './OpenPresenceForm';
import type { OpenPresenceValues } from './open-presence.schema';

const employees = [
  { value: 'e1', label: 'Camille Martin' },
  { value: 'e2', label: 'Dominique Durand' },
];

function renderForm(
  options: { opened?: boolean; submissionError?: string | null } = {},
) {
  const opened = options.opened ?? true;
  const submitted: OpenPresenceValues[] = [];

  render(
    <OpenPresenceForm
      employees={employees}
      errorPresenter={new ErrorPresenter()}
      submissionError={options.submissionError ?? null}
      onSubmit={async (values) => {
        submitted.push(values);
        return opened;
      }}
    />,
  );

  const month = screen.getByLabelText<HTMLInputElement>(
    i18n.messages.presences.month,
  );

  return {
    submitted,
    month,
    chooseEmployee: (name: string) => {
      fireEvent.keyDown(
        screen.getByRole('combobox', { name: i18n.messages.presences.employee }),
        { key: 'Enter' },
      );
      fireEvent.click(screen.getByRole('option', { name }));
    },
    chooseMonth: (value: string) =>
      fireEvent.change(month, { target: { value } }),
    open: () =>
      fireEvent.click(
        screen.getByRole('button', { name: i18n.messages.presences.open }),
      ),
  };
}

describe('OpenPresenceForm', () => {
  it('starts without employee nor month', () => {
    const { month } = renderForm();

    expect(month.value).toBe('');
    expect(
      screen.getByRole('combobox', { name: i18n.messages.presences.employee })
        .textContent,
    ).toBe('');
  });

  it('hands the chosen employee and month to its caller', async () => {
    const { chooseEmployee, chooseMonth, open, submitted } = renderForm();

    chooseEmployee('Camille Martin');
    chooseMonth('2026-10');
    open();

    await waitFor(() =>
      expect(submitted).toEqual([{ employeeId: 'e1', month: '2026-10' }]),
    );
  });

  it('asks for the missing information instead of submitting', async () => {
    const { open, submitted } = renderForm();

    open();

    await waitFor(() =>
      expect(
        screen.getAllByText(i18n.messages.errors.REQUIRED_INFORMATION),
      ).toHaveLength(2),
    );
    expect(submitted).toEqual([]);
  });

  it('shows why the month was refused', () => {
    renderForm({ submissionError: i18n.messages.errors.POTENTIAL_DUPLICATE });

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.POTENTIAL_DUPLICATE,
    );
  });

  it('keeps what was typed when the month is refused', async () => {
    const { chooseEmployee, chooseMonth, open, month, submitted } = renderForm({
      opened: false,
    });

    chooseEmployee('Camille Martin');
    chooseMonth('2026-10');
    open();

    await waitFor(() => expect(submitted).toHaveLength(1));
    expect(month.value).toBe('2026-10');
  });

  it('clears the form once the month is open', async () => {
    const { chooseEmployee, chooseMonth, open, month, submitted } = renderForm();

    chooseEmployee('Camille Martin');
    chooseMonth('2026-10');
    open();

    await waitFor(() => expect(submitted).toHaveLength(1));
    await waitFor(() => expect(month.value).toBe(''));
  });
});
