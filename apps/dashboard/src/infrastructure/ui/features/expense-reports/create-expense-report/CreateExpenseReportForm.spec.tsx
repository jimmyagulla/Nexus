import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { CreateExpenseReportForm } from './CreateExpenseReportForm';
import type { CreateExpenseReportValues } from './create-expense-report.schema';

function renderForm(
  options: { accepted?: boolean; submissionError?: string | null } = {},
) {
  const submitted: CreateExpenseReportValues[] = [];

  render(
    <CreateExpenseReportForm
      errorPresenter={new ErrorPresenter()}
      submissionError={options.submissionError ?? null}
      onSubmit={async (values) => {
        submitted.push(values);
        return options.accepted ?? true;
      }}
    />,
  );

  const label = screen.getByLabelText<HTMLInputElement>(
    i18n.messages.expenseReports.label,
  );

  return {
    submitted,
    label,
    create: () =>
      fireEvent.click(
        screen.getByRole('button', {
          name: i18n.messages.expenseReports.create,
        }),
      ),
  };
}

describe('CreateExpenseReportForm', () => {
  it('starts on an empty label', () => {
    expect(renderForm().label.value).toBe('');
  });

  it('hands the typed label to its caller', async () => {
    const { label, create, submitted } = renderForm();

    fireEvent.change(label, { target: { value: 'Déplacement Lyon' } });
    create();

    await waitFor(() =>
      expect(submitted).toEqual([{ label: 'Déplacement Lyon' }]),
    );
  });

  it('empties itself once the report is created', async () => {
    const { label, create } = renderForm();

    fireEvent.change(label, { target: { value: 'Déplacement Lyon' } });
    create();

    await waitFor(() => expect(label.value).toBe(''));
  });

  it('keeps the typed label when the api refuses it', async () => {
    const { label, create, submitted } = renderForm({ accepted: false });

    fireEvent.change(label, { target: { value: 'Déplacement Lyon' } });
    create();

    await waitFor(() => expect(submitted).toHaveLength(1));
    expect(label.value).toBe('Déplacement Lyon');
  });

  it('explains that a missing label is not enough', async () => {
    const { create, submitted } = renderForm();

    create();

    expect(
      await screen.findByText(i18n.messages.errors.REQUIRED_INFORMATION),
    ).toBeTruthy();
    expect(submitted).toEqual([]);
  });

  it('shows the refusal its caller reports', () => {
    renderForm({ submissionError: i18n.messages.errors.INACTIVE_EMPLOYEE });

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.INACTIVE_EMPLOYEE,
    );
  });

  it('reports nothing while its caller reports no refusal', () => {
    renderForm();

    expect(screen.queryByRole('alert')).toBeNull();
  });
});
