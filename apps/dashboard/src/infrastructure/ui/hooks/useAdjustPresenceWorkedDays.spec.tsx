import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ErrorCode,
  PresenceListSnapshot,
  PresenceSnapshot,
} from '@hexagonal-monorepo-template/domain';
import { PresenceController } from '../../../adapters/controllers/presence.controller';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { PresencePresenter } from '../../../adapters/presenters/presence.presenter';
import { PresenceComposition } from '../../composition/presence.composition';
import { useAdjustPresenceWorkedDays } from './useAdjustPresenceWorkedDays';
import { useGetPresences } from './useGetPresences';

const unused = {
  execute: async (): Promise<never> => {
    throw new Error('unused');
  },
};

function schedule(accepted: boolean) {
  let presence: PresenceSnapshot = {
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
  };
  const received: { presenceId: string; workedDays: number }[] = [];

  const list = async (): Promise<PresenceListSnapshot> => ({
    presences: [presence],
    employees: [],
    canManage: true,
  });
  const adjust = async (input: { presenceId: string; workedDays: number }) => {
    received.push(input);
    if (!accepted) {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    presence = { ...presence, workedDays: input.workedDays };
    return presence;
  };

  const deps: PresenceComposition = {
    controller: new PresenceController(
      { execute: list },
      unused,
      { execute: adjust },
    ),
    presenter: new PresencePresenter(),
    errorPresenter: new ErrorPresenter(),
  };
  return { deps, received };
}

function renderHooks(deps: PresenceComposition) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return renderHook(
    () => ({
      presences: useGetPresences(deps),
      adjust: useAdjustPresenceWorkedDays(deps),
    }),
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    },
  );
}

describe('useAdjustPresenceWorkedDays', () => {
  it('hands the presence and the corrected days to the controller', async () => {
    const { deps, received } = schedule(true);
    const { result } = renderHooks(deps);

    await act(async () => {
      await result.current.adjust.mutateAsync({
        presenceId: 'p1',
        workedDays: 20,
      });
    });

    expect(received).toEqual([{ presenceId: 'p1', workedDays: 20 }]);
  });

  it('refreshes the presences once the days are corrected', async () => {
    const { deps } = schedule(true);
    const { result } = renderHooks(deps);
    await waitFor(() => expect(result.current.presences.isSuccess).toBe(true));

    await act(async () => {
      await result.current.adjust.mutateAsync({
        presenceId: 'p1',
        workedDays: 20,
      });
    });

    await waitFor(() =>
      expect(result.current.presences.data?.rows[0]?.workedDays).toBe(20),
    );
  });

  it('surfaces the refusal of the correction', async () => {
    const { deps } = schedule(false);
    const { result } = renderHooks(deps);

    await act(async () => {
      result.current.adjust.mutate({ presenceId: 'p1', workedDays: 99 });
    });
    await waitFor(() => expect(result.current.adjust.isError).toBe(true));

    expect(deps.errorPresenter.present(result.current.adjust.error)).toBe(
      deps.errorPresenter.present(new Error(ErrorCode.REQUIRED_INFORMATION)),
    );
  });

  it('leaves the days untouched when the correction is refused', async () => {
    const { deps } = schedule(false);
    const { result } = renderHooks(deps);
    await waitFor(() => expect(result.current.presences.isSuccess).toBe(true));

    await act(async () => {
      result.current.adjust.mutate({ presenceId: 'p1', workedDays: 99 });
    });
    await waitFor(() => expect(result.current.adjust.isError).toBe(true));

    expect(result.current.presences.data?.rows[0]?.workedDays).toBe(22);
  });
});
