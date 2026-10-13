import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { i18n } from '../../i18n/i18n';
import { EnrollmentCodeForm } from './EnrollmentCodeForm';

function renderForm(submissionError: string | null = null) {
  const submitted: string[] = [];

  render(
    <EnrollmentCodeForm
      errorPresenter={new ErrorPresenter()}
      submissionError={submissionError}
      onSubmit={async (code) => {
        submitted.push(code);
      }}
    />,
  );

  return {
    submitted,
    field: screen.getByLabelText<HTMLInputElement>(
      i18n.messages.enrollment.code,
    ),
    confirm: () =>
      fireEvent.click(
        screen.getByRole('button', { name: i18n.messages.enrollment.submit }),
      ),
  };
}

describe('EnrollmentCodeForm', () => {
  it('hands the typed code to its caller', async () => {
    const { confirm, field, submitted } = renderForm();

    fireEvent.change(field, { target: { value: '287082' } });
    confirm();

    await waitFor(() => expect(submitted).toEqual(['287082']));
  });

  it('refuses an empty code', async () => {
    const { confirm, submitted } = renderForm();

    confirm();

    await waitFor(() =>
      expect(
        screen.getByText(i18n.messages.errors.REQUIRED_INFORMATION),
      ).toBeTruthy(),
    );
    expect(submitted).toEqual([]);
  });

  it('refuses a code that is not made of six digits', async () => {
    const { confirm, field, submitted } = renderForm();

    fireEvent.change(field, { target: { value: '12ab' } });
    confirm();

    await waitFor(() =>
      expect(
        screen.getByText(i18n.messages.errors.REQUIRED_INFORMATION),
      ).toBeTruthy(),
    );
    expect(submitted).toEqual([]);
  });

  it('shows the refusal of the server', () => {
    renderForm(i18n.messages.errors.ACCESS_DENIED);

    expect(screen.getByText(i18n.messages.errors.ACCESS_DENIED)).toBeTruthy();
  });
});
