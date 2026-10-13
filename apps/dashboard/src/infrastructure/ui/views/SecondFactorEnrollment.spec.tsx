import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { i18n } from '../i18n/i18n';
import { SecondFactorEnrollment } from './SecondFactorEnrollment';

const labels = i18n.messages.secondFactor.enrollment;
const model = { secret: 'ABCD EFGH', provisioningUri: 'otpauth://x' };

function renderView(
  overrides: {
    recoveryCodes?: string[] | null;
    submissionError?: string | null;
  } = {},
) {
  const confirmed: string[] = [];
  render(
    <SecondFactorEnrollment
      model={model}
      errorPresenter={new ErrorPresenter()}
      recoveryCodes={overrides.recoveryCodes ?? null}
      submissionError={overrides.submissionError ?? null}
      pending={false}
      onConfirm={async (code) => {
        confirmed.push(code);
      }}
    />,
  );
  return confirmed;
}

describe('SecondFactorEnrollment', () => {
  it('shows the secret to set up and asks for the first code', () => {
    renderView();

    expect(screen.getByText(model.secret)).toBeTruthy();
    expect(screen.getByLabelText(labels.code)).toBeTruthy();
  });

  it('hands the typed code to its caller', async () => {
    const confirmed = renderView();

    fireEvent.change(screen.getByLabelText(labels.code), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: labels.confirm }));

    await waitFor(() => expect(confirmed).toEqual(['123456']));
  });

  it('shows the refusal of an invalid code and keeps asking', () => {
    renderView({
      submissionError: i18n.messages.errors.SECOND_FACTOR_REQUIRED,
    });

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.SECOND_FACTOR_REQUIRED,
    );
    expect(screen.getByLabelText(labels.code)).toBeTruthy();
  });

  it('shows no recovery code while the enrollment is unfinished', () => {
    renderView();

    expect(screen.queryByText(labels.recoveryTitle)).toBeNull();
    expect(screen.queryAllByRole('listitem')).toEqual([]);
  });

  it('announces the enrollment and shows the recovery codes once confirmed', () => {
    renderView({ recoveryCodes: ['ABCDE-23456', 'FGHIJ-23457'] });

    expect(screen.getByText(labels.done)).toBeTruthy();
    expect(screen.getByText(labels.recoveryNotice)).toBeTruthy();
    expect(
      screen.getAllByRole('listitem').map((item) => item.textContent),
    ).toEqual(['ABCDE-23456', 'FGHIJ-23457']);
  });

  it('stops asking for the code once confirmed', () => {
    renderView({ recoveryCodes: [] });

    expect(screen.queryByLabelText(labels.code)).toBeNull();
  });
});
