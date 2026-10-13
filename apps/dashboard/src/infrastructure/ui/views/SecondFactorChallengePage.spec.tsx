import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ErrorCode,
  SecondFactorChallenge,
  SecondFactorStep,
} from '@hexagonal-monorepo-template/domain';
import { SecondFactorController } from '../../../adapters/controllers/second-factor.controller';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { SecondFactorEnrollmentPresenter } from '../../../adapters/presenters/second-factor-enrollment.presenter';
import type { SecondFactorDestination } from '../../../adapters/presenters/second-factor-step.presenter';
import { SecondFactorRecoveryCodesPresenter } from '../../../adapters/presenters/second-factor-recovery-codes.presenter';
import { SecondFactorStepPresenter } from '../../../adapters/presenters/second-factor-step.presenter';
import { SecondFactorComposition } from '../../composition/second-factor.composition';
import { i18n } from '../i18n/i18n';
import { SecondFactorChallengePage } from './SecondFactorChallengePage';

const unused = {
  execute: async (): Promise<never> => {
    throw new Error('unused');
  },
};

function compositionOf(
  open: () => Promise<SecondFactorChallenge>,
): SecondFactorComposition {
  return {
    controller: new SecondFactorController(
      unused,
      unused,
      { execute: open },
      unused,
      unused,
    ),
    enrollmentPresenter: new SecondFactorEnrollmentPresenter(),
    recoveryCodesPresenter: new SecondFactorRecoveryCodesPresenter(),
    stepPresenter: new SecondFactorStepPresenter(),
    errorPresenter: new ErrorPresenter(),
  };
}

function renderPage(deps: SecondFactorComposition) {
  const destinations: SecondFactorDestination[] = [];
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <SecondFactorChallengePage
        deps={deps}
        onProceed={(destination) => destinations.push(destination)}
      />
    </QueryClientProvider>,
  );
  return destinations;
}

describe('SecondFactorChallengePage', () => {
  it('waits while the challenge opens', () => {
    renderPage(compositionOf(() => new Promise(() => undefined)));

    expect(screen.getByText(i18n.messages.loading)).toBeTruthy();
  });

  it('leads an employee who is not enrolled to the enrollment', async () => {
    const destinations = renderPage(
      compositionOf(async () => ({ step: SecondFactorStep.ENROLL })),
    );

    await waitFor(() => expect(destinations).toEqual(['ENROLLMENT']));
  });

  it('leads an enrolled employee to the verification, before any space', async () => {
    const destinations = renderPage(
      compositionOf(async () => ({ step: SecondFactorStep.VERIFY })),
    );

    await waitFor(() => expect(destinations).toEqual(['VERIFICATION']));
  });

  it('leads an employer straight to the space', async () => {
    const destinations = renderPage(
      compositionOf(async () => ({ step: SecondFactorStep.NONE })),
    );

    await waitFor(() => expect(destinations).toEqual(['SPACE']));
  });

  it('goes nowhere and explains when the challenge cannot open', async () => {
    const destinations = renderPage(
      compositionOf(async () => {
        throw new Error(ErrorCode.ACCESS_DENIED);
      }),
    );

    expect(
      await screen.findByText(i18n.messages.errors.ACCESS_DENIED),
    ).toBeTruthy();
    expect(destinations).toEqual([]);
  });
});
