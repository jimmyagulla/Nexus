import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { PublicHolidayForm } from './PublicHolidayForm';
import type { PublicHolidayValues } from './public-holiday.schema';

function renderForm(
  options: { retained?: boolean; submissionError?: string | null } = {},
) {
  const retained = options.retained ?? true;
  const submitted: PublicHolidayValues[] = [];

  render(
    <PublicHolidayForm
      errorPresenter={new ErrorPresenter()}
      submissionError={options.submissionError ?? null}
      onSubmit={async (values) => {
        submitted.push(values);
        return retained;
      }}
    />,
  );

  const date = screen.getByLabelText<HTMLInputElement>(i18n.messages.settings.date);
  const label = screen.getByLabelText<HTMLInputElement>(i18n.messages.settings.label);

  return {
    submitted,
    date,
    label,
    fill: (values: PublicHolidayValues) => {
      fireEvent.change(date, { target: { value: values.date } });
      fireEvent.change(label, { target: { value: values.label } });
    },
    add: () =>
      fireEvent.click(
        screen.getByRole('button', { name: i18n.messages.settings.addHoliday }),
      ),
  };
}

describe('PublicHolidayForm', () => {
  it('starts on an empty public holiday', () => {
    const { date, label } = renderForm();

    expect([date.value, label.value]).toEqual(['', '']);
  });

  it('hands the typed public holiday to its caller', async () => {
    const { fill, add, submitted } = renderForm();

    fill({ date: '2026-07-14', label: 'Fête nationale' });
    add();

    await waitFor(() =>
      expect(submitted).toEqual([
        { date: '2026-07-14', label: 'Fête nationale' },
      ]),
    );
  });

  it('drops the spaces surrounding the typed label', async () => {
    const { fill, add, submitted } = renderForm();

    fill({ date: '2026-07-14', label: '  Fête nationale  ' });
    add();

    await waitFor(() =>
      expect(submitted).toEqual([
        { date: '2026-07-14', label: 'Fête nationale' },
      ]),
    );
  });

  it('empties itself once the public holiday is added', async () => {
    const { fill, add, date, label } = renderForm();

    fill({ date: '2026-07-14', label: 'Fête nationale' });
    add();

    await waitFor(() => expect([date.value, label.value]).toEqual(['', '']));
  });

  it('stays quiet until the public holiday is submitted', () => {
    renderForm();

    expect(screen.queryByText(i18n.messages.errors.REQUIRED_INFORMATION)).toBeNull();
  });

  it('explains that a missing date is not enough', async () => {
    const { fill, add } = renderForm();

    fill({ date: '', label: 'Fête nationale' });
    add();

    expect(
      await screen.findByText(i18n.messages.errors.REQUIRED_INFORMATION),
    ).toBeTruthy();
  });

  it('refuses to submit a public holiday without a date', async () => {
    const { fill, add, submitted } = renderForm();

    fill({ date: '', label: 'Fête nationale' });
    add();

    await screen.findByText(i18n.messages.errors.REQUIRED_INFORMATION);
    expect(submitted).toEqual([]);
  });

  it('refuses to submit a public holiday whose label is made of spaces', async () => {
    const { fill, add, submitted } = renderForm();

    fill({ date: '2026-07-14', label: '   ' });
    add();

    await screen.findByText(i18n.messages.errors.REQUIRED_INFORMATION);
    expect(submitted).toEqual([]);
  });

  it('complains about the date and the label when both are missing', async () => {
    const { add } = renderForm();

    add();

    await waitFor(() =>
      expect(
        screen.getAllByText(i18n.messages.errors.REQUIRED_INFORMATION),
      ).toHaveLength(2),
    );
  });

  it('keeps the typed public holiday when the api refuses it', async () => {
    const { fill, add, date, label } = renderForm({ retained: false });

    fill({ date: '2026-07-14', label: 'Fête nationale' });
    add();

    await waitFor(() =>
      expect([date.value, label.value]).toEqual([
        '2026-07-14',
        'Fête nationale',
      ]),
    );
  });

  it('shows the refusal its caller reports', () => {
    renderForm({ submissionError: i18n.messages.errors.POTENTIAL_DUPLICATE });

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.POTENTIAL_DUPLICATE,
    );
  });

  it('reports nothing while its caller reports no refusal', () => {
    renderForm();

    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('keeps the typed public holiday when the submission is refused', async () => {
    const { fill, add, date, label } = renderForm();

    fill({ date: '', label: 'Fête nationale' });
    add();

    await screen.findByText(i18n.messages.errors.REQUIRED_INFORMATION);
    expect([date.value, label.value]).toEqual(['', 'Fête nationale']);
  });
});
