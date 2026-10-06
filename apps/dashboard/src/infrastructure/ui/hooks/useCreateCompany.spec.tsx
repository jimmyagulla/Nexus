import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CompanySettingsSnapshot } from '@hexagonal-monorepo-template/ports';
import { useCreateCompany } from './useCreateCompany';

const created: CompanySettingsSnapshot = {
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

describe('useCreateCompany', () => {
  it('creates a company from the command and keeps its id', async () => {
    localStorage.clear();
    const controller = {
      create: vi.fn().mockResolvedValue(created),
    };
    const client = new QueryClient();
    const { result } = renderHook(
      () => useCreateCompany({ controller }),
      { wrapper: wrapper(client) },
    );

    await result.current.mutateAsync({ name: 'Acme' });

    await waitFor(() => {
      expect(controller.create).toHaveBeenCalledWith({ name: 'Acme' });
    });
    expect(localStorage.getItem('nexus.companyId')).toBe('c1');
  });
});
