import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';
import type { WeekdayViewModel } from '../../../../../adapters/presenters/company-settings.presenter';
import { i18n } from '../../../i18n/i18n';
import { NonWorkingWeekdaysForm } from './NonWorkingWeekdaysForm';

function weekdaysRetaining(...retained: DayOfWeek[]): WeekdayViewModel[] {
  return Object.values(DayOfWeek).map((value) => ({
    value,
    label: i18n.messages.days[value],
    selected: retained.includes(value),
  }));
}

function renderForm(...retained: DayOfWeek[]) {
  return renderFormReporting(null, ...retained);
}

function renderFormReporting(
  submissionError: string | null,
  ...retained: DayOfWeek[]
) {
  const submitted: DayOfWeek[][] = [];

  render(
    <NonWorkingWeekdaysForm
      weekdays={weekdaysRetaining(...retained)}
      selectedWeekdays={retained}
      submissionError={submissionError}
      onSubmit={async (weekdays) => {
        submitted.push([...weekdays]);
      }}
    />,
  );

  return {
    submitted,
    toggle: (weekday: DayOfWeek) =>
      fireEvent.click(screen.getByLabelText(i18n.messages.days[weekday])),
    save: () =>
      fireEvent.click(
        screen.getByRole('button', { name: i18n.messages.settings.saveWeekdays }),
      ),
  };
}

describe('NonWorkingWeekdaysForm', () => {
  it('offers one checkbox per weekday', () => {
    renderForm();

    expect(screen.getAllByRole('checkbox')).toHaveLength(7);
  });

  it('names every weekday in french', () => {
    renderForm();

    Object.values(DayOfWeek).forEach((weekday) => {
      expect(screen.getByLabelText(i18n.messages.days[weekday])).toBeTruthy();
    });
  });

  it('ticks the weekdays the company already retains', () => {
    renderForm(DayOfWeek.SATURDAY, DayOfWeek.SUNDAY);

    expect(
      screen
        .getAllByRole<HTMLInputElement>('checkbox')
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value),
    ).toEqual([DayOfWeek.SUNDAY, DayOfWeek.SATURDAY]);
  });

  it('leaves every weekday untouched when none is retained', () => {
    renderForm();

    expect(
      screen
        .getAllByRole<HTMLInputElement>('checkbox')
        .some((checkbox) => checkbox.checked),
    ).toBe(false);
  });

  it('hands the ticked weekdays to its caller', async () => {
    const { toggle, save, submitted } = renderForm();

    toggle(DayOfWeek.SATURDAY);
    toggle(DayOfWeek.SUNDAY);
    save();

    await waitFor(() =>
      expect(submitted).toEqual([[DayOfWeek.SUNDAY, DayOfWeek.SATURDAY]]),
    );
  });

  it('hands the weekdays the company already retains when nothing is touched', async () => {
    const { save, submitted } = renderForm(DayOfWeek.SUNDAY);

    save();

    await waitFor(() => expect(submitted).toEqual([[DayOfWeek.SUNDAY]]));
  });

  it('hands an empty selection once every weekday is unticked', async () => {
    const { toggle, save, submitted } = renderForm(
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    );

    toggle(DayOfWeek.SATURDAY);
    toggle(DayOfWeek.SUNDAY);
    save();

    await waitFor(() => expect(submitted).toEqual([[]]));
  });

  it('shows the refusal its caller reports, next to the weekdays', () => {
    renderFormReporting(i18n.messages.errors.ACCESS_DENIED, DayOfWeek.SUNDAY);

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.ACCESS_DENIED,
    );
  });

  it('reports nothing while its caller reports no refusal', () => {
    renderForm();

    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('drops the weekday the user unticks and keeps the others', async () => {
    const { toggle, save, submitted } = renderForm(
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    );

    toggle(DayOfWeek.SATURDAY);
    save();

    await waitFor(() => expect(submitted).toEqual([[DayOfWeek.SUNDAY]]));
  });
});
