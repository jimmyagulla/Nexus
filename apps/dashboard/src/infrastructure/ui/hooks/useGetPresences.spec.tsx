import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ErrorCode,
  PresenceListSnapshot,
} from '@hexagonal-monorepo-template/domain';
import { PresenceController } from '../../../adapters/controllers/presence.controller';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { PresencePresenter } from '../../../adapters/presenters/presence.presenter';
import { PresenceComposition } from '../../composition/presence.composition';
import { useGetPresences } from './useGetPresences';

const unused = {
  execute: async (): Promise<never> => {
    throw new Error('unused');
  },
};

function compositionOf(
  list: () => Promise<PresenceListSnapshot>,
): PresenceComposition {
  return {
    controller: new PresenceController({ execute: list }, unused, unused),
    presenter: new PresencePresenter(),
    errorPresenter: new ErrorPresenter(),
  };
}

function renderHookWith(deps: PresenceComposition) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return renderHook(() => useGetPresences(deps), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}

describe('useGetPresences', () => {
  it('loads the presences as a view model', async () => {
    const { result } = renderHookWith(
      compositionOf(async () => ({
        presences: [
          {
            id: 'p1',
            employeeId: 'e1',
            employeeName: 'Camille Martin',
            month: '2026-10',
            workedDays: 22,
            proposedWorkedDays: 22,
            adjustments: [],
            leaves: [],
            absences: [],
            sickLeaves: [],
            overtime: [],
          },
        ],
        employees: [],
        canManage: true,
      })),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.rows).toEqual([
      {
        id: 'p1',
        employeeName: 'Camille Martin',
        monthLabel: 'Octobre 2026',
        workedDays: 22,
        originalWorkedDays: 22,
        history: [],
        leaves: [],
        absences: [],
        sickLeaves: [],
        overtime: [],
      },
    ]);
  });

  it('surfaces the refusal of the load', async () => {
    const { result } = renderHookWith(
      compositionOf(async () => {
        throw new Error(ErrorCode.ACCESS_DENIED);
      }),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect((result.current.error as Error).message).toBe(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
