import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
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
import { i18n } from '../i18n/i18n';
import {
  getCompanySettingsQueryKey,
  useGetCompanySettings,
} from './useGetCompanySettings';

const unusedPort = {
  execute: async (): Promise<never> => {
    throw new Error('unused');
  },
};

function compositionOf(
  getSettings: () => Promise<CompanySettingsSnapshot>,
): CompanySettingsComposition {
  return {
    controller: new CompanySettingsController(
      { execute: getSettings },
      unusedPort,
      unusedPort,
      unusedPort,
      unusedPort,
    ),
    presenter: new CompanySettingsPresenter(),
    errorPresenter: new ErrorPresenter(),
  };
}

function renderQuery(deps: CompanySettingsComposition) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return {
    client,
    ...renderHook(() => useGetCompanySettings(deps), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    }),
  };
}

describe('useGetCompanySettings', () => {
  it('waits while the settings are being read', () => {
    const { result } = renderQuery(
      compositionOf(() => new Promise(() => undefined)),
    );

    expect(result.current.isPending).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('hands back the settings ready for the screen', async () => {
    const { result } = renderQuery(
      compositionOf(async () => ({
        id: 'c1',
        name: 'Acme',
        nonWorkingWeekdays: [DayOfWeek.SUNDAY],
        publicHolidays: [
          { id: 'ph-1', date: '2026-07-14', label: 'Fête nationale' },
        ],
      })),
    );

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toMatchObject({
      id: 'c1',
      name: 'Acme',
      selectedWeekdays: [DayOfWeek.SUNDAY],
      publicHolidays: [
        { id: 'ph-1', date: '14/07/2026', label: 'Fête nationale' },
      ],
    });
  });

  it('translates the weekdays for a french reader', async () => {
    const { result } = renderQuery(
      compositionOf(async () => ({
        id: 'c1',
        name: 'Acme',
        nonWorkingWeekdays: [DayOfWeek.SUNDAY],
        publicHolidays: [],
      })),
    );

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data?.weekdays).toContainEqual({
      value: DayOfWeek.SUNDAY,
      label: i18n.messages.days.SUNDAY,
      selected: true,
    });
  });

  it('caches the settings under the query key it exports', async () => {
    const { result, client } = renderQuery(
      compositionOf(async () => ({
        id: 'c1',
        name: 'Acme',
        nonWorkingWeekdays: [],
        publicHolidays: [],
      })),
    );

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(client.getQueryData(getCompanySettingsQueryKey())).toEqual(
      result.current.data,
    );
  });

  it('surfaces the refusal when the settings cannot be read', async () => {
    const { result } = renderQuery(
      compositionOf(async () => {
        throw new Error(ErrorCode.ACCESS_DENIED);
      }),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it('hands the refusal over in a shape the error presenter understands', async () => {
    const deps = compositionOf(async () => {
      throw new Error(ErrorCode.ACCESS_DENIED);
    });
    const { result } = renderQuery(deps);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(deps.errorPresenter.present(result.current.error)).toBe(
      i18n.messages.errors.ACCESS_DENIED,
    );
  });
});
