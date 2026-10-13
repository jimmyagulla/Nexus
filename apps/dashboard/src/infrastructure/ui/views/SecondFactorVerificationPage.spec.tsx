import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ErrorCode,
  SecondFactorStep,
} from '@hexagonal-monorepo-template/domain';
import { SecondFactorController } from '../../../adapters/controllers/second-factor.controller';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { SecondFactorEnrollmentPresenter } from '../../../adapters/presenters/second-factor-enrollment.presenter';
import { SecondFactorRecoveryCodesPresenter } from '../../../adapters/presenters/second-factor-recovery-codes.presenter';
import { SecondFactorStepPresenter } from '../../../adapters/presenters/second-factor-step.presenter';
import { SecondFactorComposition } from '../../composition/second-factor.composition';
import { i18n } from '../i18n/i18n';
import { SecondFactorVerificationPage } from './SecondFactorVerificationPage';

const labels = i18n.messages.secondFactorVerification;

const unused = {
  execute: async (): Promise<never> => {
    throw new Error('unused');
  },
};

function compositionAccepting(...accepted: string[]): SecondFactorComposition {
  return {
    controller: new SecondFactorController(
      unused,
      unused,
      { execute: async () => ({ step: SecondFactorStep.VERIFY }) },
      {
        execute: async (code) => {
          if (!accepted.includes(code)) {
            throw new Error(ErrorCode.SECOND_FACTOR_REQUIRED);
          }
          return { verified: true };
        },
      },
      { execute: async () => ({ step: SecondFactorStep.ENROLL }) },
    ),
    enrollmentPresenter: new SecondFactorEnrollmentPresenter(),
    recoveryCodesPresenter: new SecondFactorRecoveryCodesPresenter(),
    stepPresenter: new SecondFactorStepPresenter(),
    errorPresenter: new ErrorPresenter(),
  };
}

function renderPage(deps: SecondFactorComposition) {
  const verified: string[] = [];
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <SecondFactorVerificationPage
        deps={deps}
        onVerified={() => verified.push('opened')}
      />
    </QueryClientProvider>,
  );
  return verified;
}

function type(code: string) {
  fireEvent.change(screen.getByLabelText(labels.code), {
    target: { value: code },
  });
  fireEvent.click(screen.getByRole('button', { name: labels.confirm }));
}

describe('SecondFactorVerificationPage', () => {
  it('opens the space once the usual code is verified', async () => {
    const opened = renderPage(compositionAccepting('123456'));

    type('123456');

    await waitFor(() => expect(opened).toEqual(['opened']));
    expect(await screen.findByText(labels.done)).toBeTruthy();
  });

  it('opens the space with a recovery code', async () => {
    const opened = renderPage(compositionAccepting('ABCDE-23456'));

    type('ABCDE-23456');

    await waitFor(() => expect(opened).toEqual(['opened']));
  });

  it('keeps the space closed and says so after a wrong code', async () => {
    const opened = renderPage(compositionAccepting('123456'));

    type('654321');

    expect(
      await screen.findByText(i18n.messages.errors.SECOND_FACTOR_REQUIRED),
    ).toBeTruthy();
    expect(opened).toEqual([]);
    expect(screen.queryByText(labels.done)).toBeNull();
  });

  it('does not open the space before any code is given', () => {
    const opened = renderPage(compositionAccepting('123456'));

    expect(opened).toEqual([]);
  });
});
