import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { ExpenseForm } from './ExpenseForm';
import type { ExpenseValues } from './expense.schema';

const labels = i18n.messages.expenseReports.expense;

const categories = [
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'parking', label: 'Parking' },
];

function renderForm(
  options: { accepted?: boolean; submissionError?: string | null } = {},
) {
  const submitted: ExpenseValues[] = [];

  render(
    <ExpenseForm
      categories={categories}
      errorPresenter={new ErrorPresenter()}
      submissionError={options.submissionError ?? null}
      onSubmit={async (values) => {
        submitted.push(values);
        return options.accepted ?? true;
      }}
    />,
  );

  const type = (label: string, value: string) =>
    fireEvent.change(screen.getByLabelText(label), { target: { value } });

  return {
    submitted,
    fill: (overrides: Partial<Record<string, string>> = {}) => {
      type(labels.date, overrides.date ?? '2026-10-05');
      type(labels.category, overrides.category ?? 'restaurant');
      type(labels.amount, overrides.amount ?? '45');
      type(labels.vat, overrides.vat ?? '');
      type(labels.paymentMethod, overrides.paymentMethod ?? 'Carte');
      type(labels.description, overrides.description ?? 'Déjeuner client');
      type(labels.assignment, overrides.assignment ?? 'Client Dupont');
    },
    add: () =>
      fireEvent.click(
        screen.getByRole('button', {
          name: i18n.messages.expenseReports.addExpense,
        }),
      ),
    field: (label: string) =>
      screen.getByLabelText<HTMLInputElement | HTMLSelectElement>(label),
  };
}

describe('ExpenseForm', () => {
  it('offers the categories of the company', () => {
    renderForm();

    expect(
      Array.from(
        screen.getByLabelText<HTMLSelectElement>(labels.category).options,
      ).map((option) => option.textContent),
    ).toEqual(['', 'Restaurant', 'Parking']);
  });

  it('hands the typed expense to its caller with the amount as a number', async () => {
    const { fill, add, submitted } = renderForm();

    fill();
    add();

    await waitFor(() =>
      expect(submitted).toEqual([
        {
          date: '2026-10-05',
          categoryId: 'restaurant',
          amount: 45,
          vat: null,
          paymentMethod: 'Carte',
          description: 'Déjeuner client',
          assignment: 'Client Dupont',
        },
      ]),
    );
  });

  it('hands the VAT when one is typed', async () => {
    const { fill, add, submitted } = renderForm();

    fill({ vat: '7,5' });
    add();

    await waitFor(() => expect(submitted[0]?.vat).toBe(7.5));
  });

  it('empties itself once the expense is added', async () => {
    const { fill, add, field } = renderForm();

    fill();
    add();

    await waitFor(() => expect(field(labels.amount).value).toBe(''));
  });

  it('keeps the typed expense when the api refuses it', async () => {
    const { fill, add, field, submitted } = renderForm({ accepted: false });

    fill();
    add();

    await waitFor(() => expect(submitted).toHaveLength(1));
    expect(field(labels.amount).value).toBe('45');
  });

  it('explains that a zero amount is refused', async () => {
    const { fill, add, submitted } = renderForm();

    fill({ amount: '0' });
    add();

    expect(
      await screen.findByText(i18n.messages.errors.INVALID_AMOUNT),
    ).toBeTruthy();
    expect(submitted).toEqual([]);
  });

  it('explains that a VAT above the amount is refused', async () => {
    const { fill, add, submitted } = renderForm();

    fill({ amount: '10', vat: '12' });
    add();

    expect(
      await screen.findByText(i18n.messages.errors.INVALID_VAT),
    ).toBeTruthy();
    expect(submitted).toEqual([]);
  });

  it('explains that missing information is not enough', async () => {
    const { add, submitted } = renderForm();

    add();

    await waitFor(() =>
      expect(
        screen.getAllByText(i18n.messages.errors.REQUIRED_INFORMATION).length,
      ).toBeGreaterThan(0),
    );
    expect(submitted).toEqual([]);
  });

  it('shows the refusal its caller reports', () => {
    renderForm({ submissionError: i18n.messages.errors.INACTIVE_EMPLOYEE });

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.INACTIVE_EMPLOYEE,
    );
  });
});
