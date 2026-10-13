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
import { useGetPresences } from './useGetPresences';
import { useOpenPresence } from './useOpenPresence';

function schedule(accepted: boolean) {
  let presences: PresenceSnapshot[] = [];
  const opened: { employeeId: string; month: string }[] = [];

  const list = async (): Promise<PresenceListSnapshot> => ({
    presences,
    employees: [],
    canManage: true,
  });
  const open = async (input: { employeeId: string; month: string }) => {
    opened.push(input);
    if (!accepted) {
      throw new Error(ErrorCode.POTENTIAL_DUPLICATE);
    }
    const presence: PresenceSnapshot = {
      id: 'p1',
      employeeId: input.employeeId,
      employeeName: 'Camille Martin',
      month: input.month,
      workedDays: 22,
    };
    presences = [...presences, presence];
    return presence;
  };

  const deps: PresenceComposition = {
    controller: new PresenceController({ execute: list }, { execute: open }),
    presenter: new PresencePresenter(),
    errorPresenter: new ErrorPresenter(),
  };
  return { deps, opened };
}

function renderHooks(deps: PresenceComposition) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return renderHook(
    () => ({
      presences: useGetPresences(deps),
      open: useOpenPresence(deps),
    }),
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    },
  );
}

describe('useOpenPresence', () => {
  it('hands the employee and the month to the controller', async () => {
    const { deps, opened } = schedule(true);
    const { result } = renderHooks(deps);

    await act(async () => {
      await result.current.open.mutateAsync({
        employeeId: 'e1',
        month: '2026-10',
      });
    });

    expect(opened).toEqual([{ employeeId: 'e1', month: '2026-10' }]);
  });

  it('refreshes the presences once the month is open', async () => {
    const { deps } = schedule(true);
    const { result } = renderHooks(deps);
    await waitFor(() => expect(result.current.presences.isSuccess).toBe(true));

    await act(async () => {
      await result.current.open.mutateAsync({
        employeeId: 'e1',
        month: '2026-10',
      });
    });

    await waitFor(() =>
      expect(result.current.presences.data?.rows).toHaveLength(1),
    );
  });

  it('surfaces the refusal of the opening', async () => {
    const { deps } = schedule(false);
    const { result } = renderHooks(deps);

    await act(async () => {
      result.current.open.mutate({ employeeId: 'e1', month: '2026-10' });
    });
    await waitFor(() => expect(result.current.open.isError).toBe(true));

    expect(deps.errorPresenter.present(result.current.open.error)).toBe(
      deps.errorPresenter.present(new Error(ErrorCode.POTENTIAL_DUPLICATE)),
    );
  });

  it('leaves the presences untouched when the opening is refused', async () => {
    const { deps } = schedule(false);
    const { result } = renderHooks(deps);
    await waitFor(() => expect(result.current.presences.isSuccess).toBe(true));

    await act(async () => {
      result.current.open.mutate({ employeeId: 'e1', month: '2026-10' });
    });
    await waitFor(() => expect(result.current.open.isError).toBe(true));

    expect(result.current.presences.data?.rows).toEqual([]);
  });
});
