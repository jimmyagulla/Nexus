import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { companySettingsQueryKey } from './useGetCompanySettings';
import { useUpdateNonWorkingWeekdays } from './useUpdateNonWorkingWeekdays';

const snapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [1, 6],
  holidays: [],
};

function wrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe('useUpdateNonWorkingWeekdays', () => {
  it('sends the selected weekdays and refreshes settings', async () => {
    const controller = {
      setWeekdays: vi.fn().mockResolvedValue(snapshot),
    };
    const client = new QueryClient();
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    const { result } = renderHook(
      () => useUpdateNonWorkingWeekdays({ controller }),
      { wrapper: wrapper(client) },
    );

    await result.current.mutateAsync({ companyId: 'c1', weekdays: [1, 6] });

    expect(controller.setWeekdays).toHaveBeenCalledWith({
      companyId: 'c1',
      weekdays: [1, 6],
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: companySettingsQueryKey('c1'),
    });
  });
});
