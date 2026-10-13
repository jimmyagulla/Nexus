import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { i18n } from '../../i18n/i18n';
import { ExpenseCategoryForm } from './ExpenseCategoryForm';
import type { ExpenseCategoryValues } from './expense-category.schema';

function renderForm(
  options: { accepted?: boolean; submissionError?: string | null } = {},
) {
  const submitted: ExpenseCategoryValues[] = [];

  render(
    <ExpenseCategoryForm
      errorPresenter={new ErrorPresenter()}
      submissionError={options.submissionError ?? null}
      onSubmit={async (values) => {
        submitted.push(values);
        return options.accepted ?? true;
      }}
    />,
  );

  const label = screen.getByLabelText<HTMLInputElement>(
    i18n.messages.expenseCategories.label,
  );

  return {
    submitted,
    label,
    add: () =>
      fireEvent.click(
        screen.getByRole('button', { name: i18n.messages.expenseCategories.add }),
      ),
  };
}

describe('ExpenseCategoryForm', () => {
  it('hands the typed label to its caller', async () => {
    const { label, add, submitted } = renderForm();

    fireEvent.change(label, { target: { value: 'Hôtel' } });
    add();

    await waitFor(() => expect(submitted).toEqual([{ label: 'Hôtel' }]));
  });

  it('empties itself once the category is added', async () => {
    const { label, add } = renderForm();

    fireEvent.change(label, { target: { value: 'Hôtel' } });
    add();

    await waitFor(() => expect(label.value).toBe(''));
  });

  it('keeps the typed label when the api refuses it', async () => {
    const { label, add, submitted } = renderForm({ accepted: false });

    fireEvent.change(label, { target: { value: 'Train' } });
    add();

    await waitFor(() => expect(submitted).toHaveLength(1));
    expect(label.value).toBe('Train');
  });

  it('explains that a missing label is not enough', async () => {
    const { add, submitted } = renderForm();

    add();

    expect(
      await screen.findByText(i18n.messages.errors.REQUIRED_INFORMATION),
    ).toBeTruthy();
    expect(submitted).toEqual([]);
  });

  it('shows the refusal its caller reports', () => {
    renderForm({ submissionError: i18n.messages.errors.POTENTIAL_DUPLICATE });

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.POTENTIAL_DUPLICATE,
    );
  });
});
