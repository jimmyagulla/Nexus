import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  CompanySettingsSnapshot,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import { CompanySettingsController } from '../../../adapters/controllers/company-settings.controller';
import { CompanySettingsPresenter } from '../../../adapters/presenters/company-settings.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { CompanySettingsComposition } from '../../composition/company-settings.composition';
import { fr } from '../i18n/fr';
import { useGetCompanySettings } from './useGetCompanySettings';
import { useRemovePublicHoliday } from './useRemovePublicHoliday';

const unusedPort = {
  execute: async (): Promise<never> => {
    throw new Error('unused');
  },
};

function companyRetainingPublicHolidays() {
  let snapshot: CompanySettingsSnapshot = {
    id: 'c1',
    name: 'Acme',
    nonWorkingWeekdays: [],
    publicHolidays: [
      { id: 'ph-1', date: '2026-07-14', label: 'Fête nationale' },
      { id: 'ph-2', date: '2026-11-11', label: 'Armistice' },
    ],
  };
  const removed: string[] = [];

  const remove = (accepted: boolean) => async (publicHolidayId: string) => {
    removed.push(publicHolidayId);
    if (!accepted) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    snapshot = {
      ...snapshot,
      publicHolidays: snapshot.publicHolidays.filter(
        (holiday) => holiday.id !== publicHolidayId,
      ),
    };
    return snapshot;
  };

  return {
    removed,
    composition: (accepted = true): CompanySettingsComposition => ({
      controller: new CompanySettingsController(
        { execute: async () => snapshot },
        unusedPort,
        unusedPort,
        unusedPort,
        { execute: remove(accepted) },
      ),
      presenter: new CompanySettingsPresenter(),
      errorPresenter: new ErrorPresenter(),
    }),
  };
}

function renderHooks(deps: CompanySettingsComposition) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return renderHook(
    () => ({
      settings: useGetCompanySettings(deps),
      removeHoliday: useRemovePublicHoliday(deps),
    }),
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    },
  );
}

describe('useRemovePublicHoliday', () => {
  it('hands the public holiday to remove to the controller', async () => {
    const company = companyRetainingPublicHolidays();
    const { result } = renderHooks(company.composition());

    await act(async () => {
      await result.current.removeHoliday.mutateAsync('ph-1');
    });

    expect(company.removed).toEqual(['ph-1']);
  });

  it('refreshes the settings once the public holiday is removed', async () => {
    const company = companyRetainingPublicHolidays();
    const { result } = renderHooks(company.composition());

    await act(async () => {
      await result.current.removeHoliday.mutateAsync('ph-1');
    });

    await waitFor(() =>
      expect(result.current.settings.data?.publicHolidays).toEqual([
        { id: 'ph-2', date: '11/11/2026', label: 'Armistice' },
      ]),
    );
  });

  it('empties the calendar once every public holiday is removed', async () => {
    const company = companyRetainingPublicHolidays();
    const { result } = renderHooks(company.composition());

    await act(async () => {
      await result.current.removeHoliday.mutateAsync('ph-1');
      await result.current.removeHoliday.mutateAsync('ph-2');
    });

    await waitFor(() =>
      expect(result.current.settings.data?.publicHolidays).toEqual([]),
    );
  });

  it('surfaces the refusal of the removal', async () => {
    const company = companyRetainingPublicHolidays();
    const deps = company.composition(false);
    const { result } = renderHooks(deps);

    await act(async () => {
      result.current.removeHoliday.mutate('ph-1');
    });
    await waitFor(() =>
      expect(result.current.removeHoliday.isError).toBe(true),
    );

    expect(
      deps.errorPresenter.present(result.current.removeHoliday.error),
    ).toBe(fr.errors.ACCESS_DENIED);
  });

  it('leaves the calendar untouched when the removal is refused', async () => {
    const company = companyRetainingPublicHolidays();
    const { result } = renderHooks(company.composition(false));

    await act(async () => {
      result.current.removeHoliday.mutate('ph-1');
    });
    await waitFor(() =>
      expect(result.current.removeHoliday.isError).toBe(true),
    );

    expect(
      result.current.settings.data?.publicHolidays.map(
        (holiday) => holiday.id,
      ),
    ).toEqual(['ph-1', 'ph-2']);
  });
});
