import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CompanySettingsSnapshot } from '@hexagonal-monorepo-template/ports';
import { CompanySettingsViewModel } from '../../../adapters/presenters/company-settings/company-settings.presenter';
import { useGetCompanySettings } from './useGetCompanySettings';

const snapshot: CompanySettingsSnapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [],
  holidays: [],
};

const viewModel: CompanySettingsViewModel = {
  id: 'c1',
  name: 'Acme',
  weekdays: [],
  holidays: [],
};

function wrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe('useGetCompanySettings', () => {
  it('loads settings through the controller and presenter', async () => {
    const controller = {
      load: vi.fn().mockResolvedValue(snapshot),
    };
    const presenter = {
      present: vi.fn().mockReturnValue(viewModel),
    };
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const { result } = renderHook(
      () =>
        useGetCompanySettings('c1', { controller, presenter }),
      { wrapper: wrapper(client) },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(controller.load).toHaveBeenCalledWith({ companyId: 'c1' });
    expect(presenter.present).toHaveBeenCalledWith(snapshot);
    expect(result.current.data).toBe(viewModel);
  });
});
