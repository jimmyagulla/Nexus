import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  CompanySettingsSnapshot,
  DayOfWeek,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import { CompanySettingsController } from '../../../adapters/controllers/company-settings.controller';
import { CompanySettingsPresenter } from '../../../adapters/presenters/company-settings.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { CompanySettingsComposition } from '../../composition/company-settings.composition';
import { fr } from '../i18n/fr';
import { useGetCompanySettings } from './useGetCompanySettings';
import { useSetNonWorkingWeekdays } from './useSetNonWorkingWeekdays';

const unusedPort = {
  execute: async (): Promise<never> => {
    throw new Error('unused');
  },
};

function companyRetaining(...retained: DayOfWeek[]) {
  let snapshot: CompanySettingsSnapshot = {
    id: 'c1',
    name: 'Acme',
    nonWorkingWeekdays: retained,
    publicHolidays: [],
  };
  const saved: DayOfWeek[][] = [];

  const save =
    (accepted: boolean) => async (weekdays: readonly DayOfWeek[]) => {
      saved.push([...weekdays]);
      if (!accepted) {
        throw new Error(ErrorCode.ACCESS_DENIED);
      }
      snapshot = { ...snapshot, nonWorkingWeekdays: [...weekdays] };
      return snapshot;
    };

  return {
    saved,
    composition: (accepted = true): CompanySettingsComposition => ({
      controller: new CompanySettingsController(
        { execute: async () => snapshot },
        unusedPort,
        { execute: save(accepted) },
        unusedPort,
        unusedPort,
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
      weekdays: useSetNonWorkingWeekdays(deps),
    }),
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    },
  );
}

describe('useSetNonWorkingWeekdays', () => {
  it('hands the retained weekdays to the controller', async () => {
    const company = companyRetaining();
    const { result } = renderHooks(company.composition());

    await act(async () => {
      await result.current.weekdays.mutateAsync([
        DayOfWeek.SATURDAY,
        DayOfWeek.SUNDAY,
      ]);
    });

    expect(company.saved).toEqual([[DayOfWeek.SATURDAY, DayOfWeek.SUNDAY]]);
  });

  it('refreshes the settings once the weekdays are retained', async () => {
    const company = companyRetaining();
    const { result } = renderHooks(company.composition());

    await act(async () => {
      await result.current.weekdays.mutateAsync([DayOfWeek.SUNDAY]);
    });

    await waitFor(() =>
      expect(result.current.settings.data?.selectedWeekdays).toEqual([
        DayOfWeek.SUNDAY,
      ]),
    );
  });

  it('marks the retained weekday on the refreshed screen', async () => {
    const company = companyRetaining();
    const { result } = renderHooks(company.composition());

    await act(async () => {
      await result.current.weekdays.mutateAsync([DayOfWeek.SUNDAY]);
    });

    await waitFor(() =>
      expect(result.current.settings.data?.weekdays).toContainEqual({
        value: DayOfWeek.SUNDAY,
        label: fr.days.SUNDAY,
        selected: true,
      }),
    );
  });

  it('hands over an empty selection without complaining', async () => {
    const company = companyRetaining(DayOfWeek.SUNDAY);
    const { result } = renderHooks(company.composition());

    await act(async () => {
      await result.current.weekdays.mutateAsync([]);
    });

    await waitFor(() =>
      expect(result.current.settings.data?.selectedWeekdays).toEqual([]),
    );
  });

  it('surfaces the refusal of the change', async () => {
    const company = companyRetaining(DayOfWeek.SUNDAY);
    const deps = company.composition(false);
    const { result } = renderHooks(deps);

    await act(async () => {
      result.current.weekdays.mutate([DayOfWeek.MONDAY]);
    });
    await waitFor(() => expect(result.current.weekdays.isError).toBe(true));

    expect(deps.errorPresenter.present(result.current.weekdays.error)).toBe(
      fr.errors.ACCESS_DENIED,
    );
  });

  it('leaves the retained weekdays untouched when the change is refused', async () => {
    const company = companyRetaining(DayOfWeek.SUNDAY);
    const { result } = renderHooks(company.composition(false));

    await act(async () => {
      result.current.weekdays.mutate([DayOfWeek.MONDAY]);
    });
    await waitFor(() => expect(result.current.weekdays.isError).toBe(true));

    expect(result.current.settings.data?.selectedWeekdays).toEqual([
      DayOfWeek.SUNDAY,
    ]);
  });
});
