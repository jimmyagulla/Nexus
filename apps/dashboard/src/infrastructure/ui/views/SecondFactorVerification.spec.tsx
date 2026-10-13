import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { i18n } from '../i18n/i18n';
import { SecondFactorVerification } from './SecondFactorVerification';

const labels = i18n.messages.secondFactorVerification;

function renderView(
  overrides: { verified?: boolean; submissionError?: string | null } = {},
) {
  const verified: string[] = [];
  render(
    <SecondFactorVerification
      errorPresenter={new ErrorPresenter()}
      verified={overrides.verified ?? false}
      submissionError={overrides.submissionError ?? null}
      pending={false}
      onVerify={async (code) => {
        verified.push(code);
      }}
    />,
  );
  return verified;
}

function type(code: string) {
  fireEvent.change(screen.getByLabelText(labels.code), {
    target: { value: code },
  });
  fireEvent.click(screen.getByRole('button', { name: labels.confirm }));
}

describe('SecondFactorVerification', () => {
  it('asks for the code of the authenticator application', () => {
    renderView();

    expect(screen.getByText(labels.instructions)).toBeTruthy();
    expect(screen.getByLabelText(labels.code)).toBeTruthy();
  });

  it('hands the usual code to its caller', async () => {
    const verified = renderView();

    type('123456');

    await waitFor(() => expect(verified).toEqual(['123456']));
  });

  it('accepts a recovery code in place of the usual code', async () => {
    const verified = renderView();

    type('ABCDE-23456');

    await waitFor(() => expect(verified).toEqual(['ABCDE-23456']));
  });

  it('refuses a code that is neither of them and submits nothing', async () => {
    const verified = renderView();

    type('12ab');

    expect(
      await screen.findByText(i18n.messages.errors.SECOND_FACTOR_REQUIRED),
    ).toBeTruthy();
    expect(verified).toEqual([]);
  });

  it('shows the refusal its caller reports', () => {
    renderView({
      submissionError: i18n.messages.errors.SECOND_FACTOR_REQUIRED,
    });

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.SECOND_FACTOR_REQUIRED,
    );
  });

  it('announces the verification once done', () => {
    renderView({ verified: true });

    expect(screen.getByText(labels.done)).toBeTruthy();
    expect(screen.queryByLabelText(labels.code)).toBeNull();
  });
});
