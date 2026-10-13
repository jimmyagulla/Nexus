import { isRedirect } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';
import {
  ErrorCode,
  SecondFactorStatus,
  SecondFactorStep,
} from '@hexagonal-monorepo-template/domain';
import { SecondFactorController } from '../../../adapters/controllers/second-factor.controller';
import { SecondFactorStepPresenter } from '../../../adapters/presenters/second-factor-step.presenter';
import { AppRoutes } from './app-routes';
import { requireSecondFactor } from './require-second-factor';

const unused = {
  execute: async (): Promise<never> => {
    throw new Error('unused');
  },
};

function gateOf(status: () => Promise<SecondFactorStatus>) {
  return {
    controller: new SecondFactorController(
      unused,
      unused,
      unused,
      unused,
      { execute: status },
    ),
    stepPresenter: new SecondFactorStepPresenter(),
  };
}

async function redirectionOf(
  status: () => Promise<SecondFactorStatus>,
): Promise<string | null> {
  try {
    await requireSecondFactor(gateOf(status));
    return null;
  } catch (error) {
    if (isRedirect(error)) {
      return error.options.to as string;
    }
    throw error;
  }
}

describe('requireSecondFactor', () => {
  it('leads an employee who is not enrolled to the enrollment instead of the page', async () => {
    expect(
      await redirectionOf(async () => ({ step: SecondFactorStep.ENROLL })),
    ).toBe(AppRoutes.secondFactorEnrollment);
  });

  it('leads an enrolled employee who has not verified to the verification', async () => {
    expect(
      await redirectionOf(async () => ({ step: SecondFactorStep.VERIFY })),
    ).toBe(AppRoutes.secondFactorVerification);
  });

  it('lets through whoever owes no second factor', async () => {
    expect(
      await redirectionOf(async () => ({ step: SecondFactorStep.NONE })),
    ).toBeNull();
  });

  it('leaves the refusal to the api when the status cannot be read', async () => {
    expect(
      await redirectionOf(async () => {
        throw new Error(ErrorCode.ACCESS_DENIED);
      }),
    ).toBeNull();
  });
});
