import { fireEvent, render, screen } from '@testing-library/react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';
import { fr } from '../../i18n/fr';
import { WeekdayCheckbox } from './WeekdayCheckbox';

function registrationRecording(ticked: string[]): UseFormRegisterReturn {
  return {
    name: 'weekdays',
    onChange: async (event: { target: unknown }) => {
      if (event.target instanceof HTMLInputElement && event.target.checked) {
        ticked.push(event.target.value);
      }
    },
    onBlur: async () => undefined,
    ref: () => undefined,
  };
}

function renderCheckbox(weekday: DayOfWeek, selected: boolean) {
  const ticked: string[] = [];

  render(
    <WeekdayCheckbox
      weekday={{ value: weekday, label: fr.days[weekday], selected }}
      registration={registrationRecording(ticked)}
    />,
  );

  return {
    ticked,
    checkbox: screen.getByLabelText<HTMLInputElement>(fr.days[weekday]),
  };
}

describe('WeekdayCheckbox', () => {
  it('names the weekday next to its checkbox', () => {
    const { checkbox } = renderCheckbox(DayOfWeek.SUNDAY, false);

    expect(checkbox.type).toBe('checkbox');
  });

  it('ticks the checkbox of a retained weekday', () => {
    const { checkbox } = renderCheckbox(DayOfWeek.SUNDAY, true);

    expect(checkbox.checked).toBe(true);
  });

  it('leaves the checkbox of a weekday that is not retained', () => {
    const { checkbox } = renderCheckbox(DayOfWeek.SUNDAY, false);

    expect(checkbox.checked).toBe(false);
  });

  it('carries the weekday as the value the form will read', () => {
    const { checkbox } = renderCheckbox(DayOfWeek.WEDNESDAY, false);

    expect(checkbox.value).toBe(DayOfWeek.WEDNESDAY);
  });

  it('hands the weekday to the form when the user ticks it', () => {
    const { checkbox, ticked } = renderCheckbox(DayOfWeek.FRIDAY, false);

    fireEvent.click(checkbox);

    expect(ticked).toEqual([DayOfWeek.FRIDAY]);
  });

  it('reports the weekday as unticked when the user unticks it', () => {
    const { checkbox, ticked } = renderCheckbox(DayOfWeek.FRIDAY, true);

    fireEvent.click(checkbox);

    expect([checkbox.checked, ticked]).toEqual([false, []]);
  });
});
