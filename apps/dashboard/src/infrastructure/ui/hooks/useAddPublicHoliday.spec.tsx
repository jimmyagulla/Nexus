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
import { useAddPublicHoliday } from './useAddPublicHoliday';
import { useGetCompanySettings } from './useGetCompanySettings';

const unusedPort = {
  execute: async (): Promise<never> => {
    throw new Error('unused');
  },
};

function companyWithoutPublicHoliday() {
  let snapshot: CompanySettingsSnapshot = {
    id: 'c1',
    name: 'Acme',
    nonWorkingWeekdays: [],
    publicHolidays: [],
  };
  const added: { date: string; label: string }[] = [];

  const add =
    (accepted: boolean) => async (input: { date: string; label: string }) => {
      added.push(input);
      if (!accepted) {
        throw new Error(ErrorCode.POTENTIAL_DUPLICATE);
      }
      snapshot = {
        ...snapshot,
        publicHolidays: [
          ...snapshot.publicHolidays,
          { id: `ph-${added.length}`, ...input },
        ],
      };
      return snapshot;
    };

  return {
    added,
    composition: (accepted = true): CompanySettingsComposition => ({
      controller: new CompanySettingsController(
        { execute: async () => snapshot },
        unusedPort,
        unusedPort,
        { execute: add(accepted) },
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
      addHoliday: useAddPublicHoliday(deps),
    }),
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    },
  );
}

describe('useAddPublicHoliday', () => {
  it('hands the public holiday to the controller', async () => {
    const company = companyWithoutPublicHoliday();
    const { result } = renderHooks(company.composition());

    await act(async () => {
      await result.current.addHoliday.mutateAsync({
        date: '2026-07-14',
        label: 'Fête nationale',
      });
    });

    expect(company.added).toEqual([
      { date: '2026-07-14', label: 'Fête nationale' },
    ]);
  });

  it('refreshes the settings once the public holiday is added', async () => {
    const company = companyWithoutPublicHoliday();
    const { result } = renderHooks(company.composition());

    await act(async () => {
      await result.current.addHoliday.mutateAsync({
        date: '2026-07-14',
        label: 'Fête nationale',
      });
    });

    await waitFor(() =>
      expect(result.current.settings.data?.publicHolidays).toEqual([
        { id: 'ph-1', date: '14/07/2026', label: 'Fête nationale' },
      ]),
    );
  });

  it('adds one public holiday per call', async () => {
    const company = companyWithoutPublicHoliday();
    const { result } = renderHooks(company.composition());

    await act(async () => {
      await result.current.addHoliday.mutateAsync({
        date: '2026-07-14',
        label: 'Fête nationale',
      });
      await result.current.addHoliday.mutateAsync({
        date: '2026-11-11',
        label: 'Armistice',
      });
    });

    await waitFor(() =>
      expect(
        result.current.settings.data?.publicHolidays.map(
          (holiday) => holiday.date,
        ),
      ).toEqual(['14/07/2026', '11/11/2026']),
    );
  });

  it('surfaces the refusal of a duplicate public holiday', async () => {
    const company = companyWithoutPublicHoliday();
    const deps = company.composition(false);
    const { result } = renderHooks(deps);

    await act(async () => {
      result.current.addHoliday.mutate({
        date: '2026-07-14',
        label: 'Fête nationale',
      });
    });
    await waitFor(() => expect(result.current.addHoliday.isError).toBe(true));

    expect(deps.errorPresenter.present(result.current.addHoliday.error)).toBe(
      fr.errors.POTENTIAL_DUPLICATE,
    );
  });

  it('leaves the calendar untouched when the public holiday is refused', async () => {
    const company = companyWithoutPublicHoliday();
    const { result } = renderHooks(company.composition(false));

    await act(async () => {
      result.current.addHoliday.mutate({
        date: '2026-07-14',
        label: 'Fête nationale',
      });
    });
    await waitFor(() => expect(result.current.addHoliday.isError).toBe(true));

    expect(result.current.settings.data?.publicHolidays).toEqual([]);
  });
});
