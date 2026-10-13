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

  it('hands the filters to the controller', async () => {
    const received: unknown[] = [];
    const deps: PresenceComposition = {
      controller: new PresenceController(
        {
          execute: async (filter) => {
            received.push(filter);
            return { presences: [], employees: [], canManage: true };
          },
        },
        unused,
        unused,
      ),
      presenter: new PresencePresenter(),
      errorPresenter: new ErrorPresenter(),
    };
    const filter = { employeeId: 'e1', from: '2026-08', to: '2026-10' };
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const { result } = renderHook(() => useGetPresences(deps, filter), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(received).toEqual([filter]);
  });

  it('loads again when the filters change', async () => {
    const received: unknown[] = [];
    const deps: PresenceComposition = {
      controller: new PresenceController(
        {
          execute: async (filter) => {
            received.push(filter);
            return { presences: [], employees: [], canManage: true };
          },
        },
        unused,
        unused,
      ),
      presenter: new PresencePresenter(),
      errorPresenter: new ErrorPresenter(),
    };
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const { result, rerender } = renderHook(
      ({ employeeId }: { employeeId: string }) =>
        useGetPresences(deps, { employeeId }),
      {
        initialProps: { employeeId: 'e1' },
        wrapper: ({ children }: { children: ReactNode }) => (
          <QueryClientProvider client={client}>{children}</QueryClientProvider>
        ),
      },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    rerender({ employeeId: 'e2' });

    await waitFor(() =>
      expect(received).toEqual([{ employeeId: 'e1' }, { employeeId: 'e2' }]),
    );
  });

  it('keeps the previous presences on screen while the filtered ones load', async () => {
    let release: () => void = () => undefined;
    const deps: PresenceComposition = {
      controller: new PresenceController(
        {
          execute: async (filter) => {
            if (filter?.employeeId === 'e2') {
              await new Promise<void>((resolve) => {
                release = resolve;
              });
            }
            return {
              presences: [],
              employees: [
                { id: 'e1', companyId: 'c1', fullName: 'Camille Martin' },
              ],
              canManage: true,
            };
          },
        },
        unused,
        unused,
      ),
      presenter: new PresencePresenter(),
      errorPresenter: new ErrorPresenter(),
    };
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const { result, rerender } = renderHook(
      ({ employeeId }: { employeeId: string }) =>
        useGetPresences(deps, { employeeId }),
      {
        initialProps: { employeeId: 'e1' },
        wrapper: ({ children }: { children: ReactNode }) => (
          <QueryClientProvider client={client}>{children}</QueryClientProvider>
        ),
      },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    rerender({ employeeId: 'e2' });

    await waitFor(() => expect(result.current.isFetching).toBe(true));
    expect(result.current.isPending).toBe(false);
    expect(result.current.data?.employees).toHaveLength(1);
    release();
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
