import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { AdjustWorkedDaysForm } from './AdjustWorkedDaysForm';
import type { AdjustWorkedDaysValues } from './adjust-worked-days.schema';

function renderForm(
  options: { accepted?: boolean; submissionError?: string | null } = {},
) {
  const accepted = options.accepted ?? true;
  const submitted: AdjustWorkedDaysValues[] = [];

  render(
    <AdjustWorkedDaysForm
      workedDays={22}
      errorPresenter={new ErrorPresenter()}
      submissionError={options.submissionError ?? null}
      onSubmit={async (values) => {
        submitted.push(values);
        return accepted;
      }}
    />,
  );

  const days = screen.getByLabelText<HTMLInputElement>(
    i18n.messages.presences.workedDays,
  );

  return {
    submitted,
    days,
    type: (value: string) => fireEvent.change(days, { target: { value } }),
    save: () =>
      fireEvent.click(
        screen.getByRole('button', { name: i18n.messages.presences.save }),
      ),
  };
}

describe('AdjustWorkedDaysForm', () => {
  it('starts on the days the month holds today', () => {
    const { days } = renderForm();

    expect(days.value).toBe('22');
  });

  it('hands the corrected days to its caller as a number', async () => {
    const { type, save, submitted } = renderForm();

    type('20');
    save();

    await waitFor(() => expect(submitted).toEqual([{ workedDays: 20 }]));
  });

  it('accepts no worked day at all', async () => {
    const { type, save, submitted } = renderForm();

    type('0');
    save();

    await waitFor(() => expect(submitted).toEqual([{ workedDays: 0 }]));
  });

  it('asks for valid days instead of submitting a fraction of a day', async () => {
    const { type, save, submitted } = renderForm();

    type('20.5');
    save();

    expect(
      await screen.findByText(i18n.messages.errors.REQUIRED_INFORMATION),
    ).toBeTruthy();
    expect(submitted).toEqual([]);
  });

  it('asks for valid days instead of submitting more days than a month holds', async () => {
    const { type, save, submitted } = renderForm();

    type('32');
    save();

    expect(
      await screen.findByText(i18n.messages.errors.REQUIRED_INFORMATION),
    ).toBeTruthy();
    expect(submitted).toEqual([]);
  });

  it('asks for valid days instead of submitting nothing', async () => {
    const { type, save, submitted } = renderForm();

    type('');
    save();

    expect(
      await screen.findByText(i18n.messages.errors.REQUIRED_INFORMATION),
    ).toBeTruthy();
    expect(submitted).toEqual([]);
  });

  it('shows why the correction was refused', () => {
    renderForm({ submissionError: i18n.messages.errors.ACCESS_DENIED });

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.ACCESS_DENIED,
    );
  });

  it('keeps what was typed when the correction is refused', async () => {
    const { type, save, days, submitted } = renderForm({ accepted: false });

    type('20');
    save();

    await waitFor(() => expect(submitted).toHaveLength(1));
    expect(days.value).toBe('20');
  });
});
