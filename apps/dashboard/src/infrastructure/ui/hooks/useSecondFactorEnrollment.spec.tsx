import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorCode, SecondFactorStep } from '@hexagonal-monorepo-template/domain';
import { SecondFactorController } from '../../../adapters/controllers/second-factor.controller';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { SecondFactorEnrollmentPresenter } from '../../../adapters/presenters/second-factor-enrollment.presenter';
import { SecondFactorRecoveryCodesPresenter } from '../../../adapters/presenters/second-factor-recovery-codes.presenter';
import { SecondFactorStepPresenter } from '../../../adapters/presenters/second-factor-step.presenter';
import { SecondFactorComposition } from '../../composition/second-factor.composition';
import { useConfirmSecondFactorEnrollment } from './useConfirmSecondFactorEnrollment';
import { useGetSecondFactorEnrollment } from './useGetSecondFactorEnrollment';

function compositionOf(validCode = '123456'): SecondFactorComposition {
  return {
    controller: new SecondFactorController(
      {
        execute: async () => ({
          secret: 'ABCDEFGH',
          provisioningUri: 'otpauth://x',
        }),
      },
      {
        execute: async (code) => {
          if (code !== validCode) {
            throw new Error(ErrorCode.SECOND_FACTOR_REQUIRED);
          }
          return { enrolled: true, recoveryCodes: ['ABCDE23456'] };
        },
      },
      { execute: async () => ({ step: SecondFactorStep.VERIFY }) },
      { execute: async () => ({ verified: true }) },
      { execute: async () => ({ step: SecondFactorStep.ENROLL }) },
    ),
    stepPresenter: new SecondFactorStepPresenter(),
    enrollmentPresenter: new SecondFactorEnrollmentPresenter(),
    recoveryCodesPresenter: new SecondFactorRecoveryCodesPresenter(),
    errorPresenter: new ErrorPresenter(),
  };
}

function renderHooks(deps: SecondFactorComposition) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return renderHook(
    () => ({
      enrollment: useGetSecondFactorEnrollment(deps),
      confirm: useConfirmSecondFactorEnrollment(deps),
    }),
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    },
  );
}

describe('useGetSecondFactorEnrollment', () => {
  it('presents the enrollment the session user must set up', async () => {
    const { result } = renderHooks(compositionOf());

    await waitFor(() =>
      expect(result.current.enrollment.data).toEqual({
        secret: 'ABCD EFGH',
        provisioningUri: 'otpauth://x',
      }),
    );
  });
});

describe('useConfirmSecondFactorEnrollment', () => {
  it('reports the success of a valid code', async () => {
    const { result } = renderHooks(compositionOf());

    await act(async () => {
      await result.current.confirm.mutateAsync('123456');
    });

    await waitFor(() => expect(result.current.confirm.isSuccess).toBe(true));
    expect(result.current.confirm.data).toEqual({ codes: ['ABCDE-23456'] });
  });

  it('reports the refusal of an invalid code', async () => {
    const { result } = renderHooks(compositionOf());

    await act(async () => {
      await result.current.confirm
        .mutateAsync('000000')
        .catch(() => undefined);
    });

    await waitFor(() => expect(result.current.confirm.isError).toBe(true));
    expect(result.current.confirm.error).toEqual(
      new Error(ErrorCode.SECOND_FACTOR_REQUIRED),
    );
  });
});
