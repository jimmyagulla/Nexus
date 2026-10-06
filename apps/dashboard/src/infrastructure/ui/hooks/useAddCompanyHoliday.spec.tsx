import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { companySettingsQueryKey } from './useGetCompanySettings';
import { useAddCompanyHoliday } from './useAddCompanyHoliday';

const snapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [],
  holidays: [{ id: 'h1', date: '2026-07-14', label: 'Fête nationale' }],
};

function wrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe('useAddCompanyHoliday', () => {
  it('adds a holiday through the controller and refreshes settings', async () => {
    const controller = {
      addPublicHoliday: vi.fn().mockResolvedValue(snapshot),
    };
    const client = new QueryClient();
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    const { result } = renderHook(() => useAddCompanyHoliday({ controller }), {
      wrapper: wrapper(client),
    });

    await result.current.mutateAsync({
      companyId: 'c1',
      date: '2026-07-14',
      label: 'Fête nationale',
    });

    expect(controller.addPublicHoliday).toHaveBeenCalledWith({
      companyId: 'c1',
      date: '2026-07-14',
      label: 'Fête nationale',
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: companySettingsQueryKey('c1'),
    });
  });
});
