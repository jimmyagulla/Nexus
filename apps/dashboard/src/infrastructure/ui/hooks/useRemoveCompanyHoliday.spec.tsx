import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { companySettingsQueryKey } from './useGetCompanySettings';
import { useRemoveCompanyHoliday } from './useRemoveCompanyHoliday';

const snapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [],
  holidays: [],
};

function wrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe('useRemoveCompanyHoliday', () => {
  it('removes a holiday through the controller and refreshes settings', async () => {
    const controller = {
      removePublicHoliday: vi.fn().mockResolvedValue(snapshot),
    };
    const client = new QueryClient();
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    const { result } = renderHook(() => useRemoveCompanyHoliday({ controller }), {
      wrapper: wrapper(client),
    });

    await result.current.mutateAsync({ companyId: 'c1', holidayId: 'h1' });

    expect(controller.removePublicHoliday).toHaveBeenCalledWith({
      companyId: 'c1',
      holidayId: 'h1',
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: companySettingsQueryKey('c1'),
    });
  });
});
