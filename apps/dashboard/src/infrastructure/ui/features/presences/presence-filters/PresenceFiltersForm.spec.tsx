import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { PresenceFiltersForm } from './PresenceFiltersForm';
import {
  ALL_EMPLOYEES,
  type PresenceFiltersValues,
} from './presence-filters.schema';

const employees = [
  { value: 'e1', label: 'Camille Martin' },
  { value: 'e2', label: 'Dominique Durand' },
];

function renderForm() {
  const filtered: PresenceFiltersValues[] = [];

  render(
    <PresenceFiltersForm
      employees={employees}
      errorPresenter={new ErrorPresenter()}
      onFilter={(values) => filtered.push(values)}
    />,
  );

  const from = screen.getByLabelText<HTMLInputElement>(
    i18n.messages.presences.fromMonth,
  );
  const to = screen.getByLabelText<HTMLInputElement>(
    i18n.messages.presences.toMonth,
  );

  return {
    filtered,
    from,
    to,
    chooseEmployee: (name: string) => {
      fireEvent.keyDown(
        screen.getByRole('combobox', { name: i18n.messages.presences.employee }),
        { key: 'Enter' },
      );
      fireEvent.click(screen.getByRole('option', { name }));
    },
    type: (field: HTMLInputElement, value: string) =>
      fireEvent.change(field, { target: { value } }),
    filter: () =>
      fireEvent.click(
        screen.getByRole('button', { name: i18n.messages.presences.filter }),
      ),
    reset: () =>
      fireEvent.click(
        screen.getByRole('button', { name: i18n.messages.presences.resetFilters }),
      ),
  };
}

describe('PresenceFiltersForm', () => {
  it('starts on every employee and no period', () => {
    const { from, to } = renderForm();

    expect([from.value, to.value]).toEqual(['', '']);
    expect(
      screen.getByRole('combobox', { name: i18n.messages.presences.employee })
        .textContent,
    ).toBe(i18n.messages.presences.allEmployees);
  });

  it('hands the chosen employee and period to its caller', async () => {
    const { chooseEmployee, type, from, to, filter, filtered } = renderForm();

    chooseEmployee('Dominique Durand');
    type(from, '2026-08');
    type(to, '2026-10');
    filter();

    await waitFor(() =>
      expect(filtered).toEqual([
        { employeeId: 'e2', from: '2026-08', to: '2026-10' },
      ]),
    );
  });

  it('hands every employee when none was chosen', async () => {
    const { filter, filtered } = renderForm();

    filter();

    await waitFor(() =>
      expect(filtered).toEqual([{ employeeId: ALL_EMPLOYEES, from: '', to: '' }]),
    );
  });

  it('refuses a period whose end precedes its start', async () => {
    const { type, from, to, filter, filtered } = renderForm();

    type(from, '2026-10');
    type(to, '2026-09');
    filter();

    expect(
      await screen.findByText(i18n.messages.errors.INVALID_PERIOD),
    ).toBeTruthy();
    expect(filtered).toEqual([]);
  });

  it('clears the filters and hands the open filters back on reset', async () => {
    const { chooseEmployee, type, from, to, reset, filtered } = renderForm();
    chooseEmployee('Camille Martin');
    type(from, '2026-08');
    type(to, '2026-10');

    reset();

    await waitFor(() =>
      expect(filtered).toEqual([{ employeeId: ALL_EMPLOYEES, from: '', to: '' }]),
    );
    expect([from.value, to.value]).toEqual(['', '']);
  });
});
