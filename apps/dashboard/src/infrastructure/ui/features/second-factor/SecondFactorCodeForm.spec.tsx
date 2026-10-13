import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { i18n } from '../../i18n/i18n';
import { SecondFactorCodeForm } from './SecondFactorCodeForm';

const labels = i18n.messages.secondFactor.enrollment;

function renderForm(
  submissionError: string | null = null,
  pending = false,
) {
  const submitted: string[] = [];

  render(
    <SecondFactorCodeForm
      label={labels.code}
      submitLabel={labels.confirm}
      errorPresenter={new ErrorPresenter()}
      submissionError={submissionError}
      pending={pending}
      onSubmit={async (code) => {
        submitted.push(code);
      }}
    />,
  );

  return {
    submitted,
    field: screen.getByLabelText<HTMLInputElement>(labels.code),
    submit: () =>
      fireEvent.click(screen.getByRole('button', { name: labels.confirm })),
  };
}

describe('SecondFactorCodeForm', () => {
  it('hands the typed code to its caller', async () => {
    const { field, submit, submitted } = renderForm();

    fireEvent.change(field, { target: { value: '123456' } });
    submit();

    await waitFor(() => expect(submitted).toEqual(['123456']));
  });

  it('asks for the code when it is empty and submits nothing', async () => {
    const { submit, submitted } = renderForm();

    submit();

    expect(
      await screen.findByText(i18n.messages.errors.REQUIRED_INFORMATION),
    ).toBeTruthy();
    expect(submitted).toEqual([]);
  });

  it('explains that the second factor is required when the code is malformed', async () => {
    const { field, submit, submitted } = renderForm();

    fireEvent.change(field, { target: { value: '12ab' } });
    submit();

    expect(
      await screen.findByText(i18n.messages.errors.SECOND_FACTOR_REQUIRED),
    ).toBeTruthy();
    expect(submitted).toEqual([]);
  });

  it('shows the refusal its caller reports', () => {
    renderForm(i18n.messages.errors.SECOND_FACTOR_REQUIRED);

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.SECOND_FACTOR_REQUIRED,
    );
  });

  it('cannot be submitted again while the code is being checked', () => {
    renderForm(null, true);

    expect(
      screen
        .getByRole<HTMLButtonElement>('button', { name: labels.confirm })
        .disabled,
    ).toBe(true);
  });
});
