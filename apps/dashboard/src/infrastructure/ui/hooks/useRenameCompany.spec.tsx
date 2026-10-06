import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { companySettingsQueryKey } from './useGetCompanySettings';
import { useRenameCompany } from './useRenameCompany';

const snapshot = {
  id: 'c1',
  name: 'Acme RH',
  nonWorkingWeekdays: [],
  holidays: [],
};

function wrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe('useRenameCompany', () => {
  it('renames through the controller and refreshes settings', async () => {
    const controller = {
      rename: vi.fn().mockResolvedValue(snapshot),
    };
    const client = new QueryClient();
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    const { result } = renderHook(() => useRenameCompany({ controller }), {
      wrapper: wrapper(client),
    });

    await result.current.mutateAsync({ companyId: 'c1', name: 'Acme RH' });

    expect(controller.rename).toHaveBeenCalledWith({
      companyId: 'c1',
      name: 'Acme RH',
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: companySettingsQueryKey('c1'),
    });
  });
});
