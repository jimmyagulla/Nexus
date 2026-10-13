import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ExpenseReportFilterInput } from '@hexagonal-monorepo-template/domain';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { ExpenseReportFilterForm } from './ExpenseReportFilterForm';

const labels = i18n.messages.expenseReports.filters;

function renderForm(byEmployee: boolean) {
  const applied: ExpenseReportFilterInput[] = [];
  let resets = 0;

  render(
    <ExpenseReportFilterForm
      byEmployee={byEmployee}
      errorPresenter={new ErrorPresenter()}
      onApply={(filter) => applied.push(filter)}
      onReset={() => {
        resets += 1;
      }}
    />,
  );

  return {
    applied,
    resets: () => resets,
    type: (label: string, value: string) =>
      fireEvent.change(screen.getByLabelText(label), { target: { value } }),
    apply: () =>
      fireEvent.click(screen.getByRole('button', { name: labels.apply })),
  };
}

describe('ExpenseReportFilterForm', () => {
  it('applies a filter without criterion when nothing is typed', async () => {
    const { apply, applied } = renderForm(false);

    apply();

    await waitFor(() => expect(applied).toEqual([{}]));
  });

  it('applies the period, the status and the amounts the employee types', async () => {
    const { type, apply, applied } = renderForm(false);

    type(labels.from, '2026-10-01');
    type(labels.to, '2026-10-31');
    type(labels.status, 'SUBMITTED');
    type(labels.minAmount, '10');
    type(labels.maxAmount, '500,5');
    apply();

    await waitFor(() =>
      expect(applied).toEqual([
        {
          from: '2026-10-01',
          to: '2026-10-31',
          status: 'SUBMITTED',
          minAmount: 10,
          maxAmount: 500.5,
        },
      ]),
    );
  });

  it('offers every status of the report and an option for all of them', () => {
    renderForm(false);

    expect(
      Array.from(
        screen.getByLabelText<HTMLSelectElement>(labels.status).options,
      ).map((option) => option.textContent),
    ).toEqual([
      labels.allStatuses,
      'Brouillon',
      'Soumise',
      'En cours de validation',
      'Validée',
      'Refusée',
      'Remboursée',
    ]);
  });

  it('does not let the employee filter by employee', () => {
    renderForm(false);

    expect(screen.queryByLabelText(labels.employee)).toBeNull();
  });

  it('lets the employer filter by employee', async () => {
    const { type, apply, applied } = renderForm(true);

    type(labels.employee, 'e1');
    apply();

    await waitFor(() => expect(applied).toEqual([{ employeeId: 'e1' }]));
  });

  it('explains that a period cannot end before it starts', async () => {
    const { type, apply, applied } = renderForm(false);

    type(labels.from, '2026-10-31');
    type(labels.to, '2026-10-01');
    apply();

    expect(
      await screen.findByText(i18n.messages.errors.INVALID_PERIOD),
    ).toBeTruthy();
    expect(applied).toEqual([]);
  });

  it('explains that an amount cannot be negative', async () => {
    const { type, apply, applied } = renderForm(false);

    type(labels.minAmount, '-5');
    apply();

    expect(
      await screen.findByText(i18n.messages.errors.INVALID_AMOUNT),
    ).toBeTruthy();
    expect(applied).toEqual([]);
  });

  it('empties the form and tells it was reset', async () => {
    const { type, resets } = renderForm(false);
    type(labels.minAmount, '10');

    fireEvent.click(screen.getByRole('button', { name: labels.reset }));

    await waitFor(() => expect(resets()).toBe(1));
    expect(
      screen.getByLabelText<HTMLInputElement>(labels.minAmount).value,
    ).toBe('');
  });
});
