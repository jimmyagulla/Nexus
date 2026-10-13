import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { i18n } from '../../i18n/i18n';
import { ActivationForm } from './ActivationForm';

function renderForm(submissionError: string | null = null) {
  const submitted: string[] = [];

  render(
    <ActivationForm
      errorPresenter={new ErrorPresenter()}
      submissionError={submissionError}
      onSubmit={async (value) => {
        submitted.push(value);
      }}
    />,
  );

  return {
    submitted,
    field: screen.getByLabelText<HTMLInputElement>(
      i18n.messages.activation.secret,
    ),
    save: () =>
      fireEvent.click(
        screen.getByRole('button', {
          name: i18n.messages.activation.submit,
        }),
      ),
  };
}

describe('ActivationForm', () => {
  it('hands the chosen secret to its caller', async () => {
    const { field, save, submitted } = renderForm();

    fireEvent.change(field, { target: { value: 's3cret' } });
    save();

    await waitFor(() => expect(submitted).toEqual(['s3cret']));
  });

  it('refuses an empty secret', async () => {
    const { save, submitted } = renderForm();

    save();

    await waitFor(() =>
      expect(
        screen.getByText(i18n.messages.errors.REQUIRED_INFORMATION),
      ).toBeTruthy(),
    );
    expect(submitted).toEqual([]);
  });
});
