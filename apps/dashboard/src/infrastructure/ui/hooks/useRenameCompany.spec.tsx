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
import { i18n } from '../i18n/i18n';
import { useGetCompanySettings } from './useGetCompanySettings';
import { useRenameCompany } from './useRenameCompany';

type RenameOutcome = 'accepted' | 'refused' | 'hanging';

const unusedPort = {
  execute: async (): Promise<never> => {
    throw new Error('unused');
  },
};

function companyNamed(name: string) {
  let snapshot: CompanySettingsSnapshot = {
    id: 'c1',
    name,
    nonWorkingWeekdays: [],
    publicHolidays: [],
  };
  const renamed: string[] = [];

  const rename =
    (outcome: RenameOutcome) => async (value: string) => {
      renamed.push(value);
      if (outcome === 'hanging') {
        return new Promise<CompanySettingsSnapshot>(() => undefined);
      }
      if (outcome === 'refused') {
        throw new Error(ErrorCode.ACCESS_DENIED);
      }
      snapshot = { ...snapshot, name: value };
      return snapshot;
    };

  return {
    renamed,
    composition: (
      outcome: RenameOutcome = 'accepted',
    ): CompanySettingsComposition => ({
      controller: new CompanySettingsController(
        { execute: async () => snapshot },
        { execute: rename(outcome) },
        unusedPort,
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
      rename: useRenameCompany(deps),
    }),
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    },
  );
}

describe('useRenameCompany', () => {
  it('hands the new name to the controller', async () => {
    const company = companyNamed('Acme');
    const { result } = renderHooks(company.composition());

    await act(async () => {
      await result.current.rename.mutateAsync('Nexus');
    });

    expect(company.renamed).toEqual(['Nexus']);
  });

  it('refreshes the settings once the company is renamed', async () => {
    const company = companyNamed('Acme');
    const { result } = renderHooks(company.composition());

    await act(async () => {
      await result.current.rename.mutateAsync('Nexus');
    });

    await waitFor(() =>
      expect(result.current.settings.data?.name).toBe('Nexus'),
    );
  });

  it('reports the success of the rename', async () => {
    const company = companyNamed('Acme');
    const { result } = renderHooks(company.composition());

    await act(async () => {
      await result.current.rename.mutateAsync('Nexus');
    });

    await waitFor(() => expect(result.current.rename.isSuccess).toBe(true));
  });

  it('stays idle until the company is renamed', async () => {
    const company = companyNamed('Acme');
    const { result } = renderHooks(company.composition());

    await waitFor(() => expect(result.current.settings.data).toBeDefined());
    expect(result.current.rename.isPending).toBe(false);
    expect(result.current.rename.isSuccess).toBe(false);
  });

  it('reports the rename while it is still under way', async () => {
    const company = companyNamed('Acme');
    const { result } = renderHooks(company.composition('hanging'));

    await act(async () => {
      result.current.rename.mutate('Nexus');
    });

    await waitFor(() => expect(result.current.rename.isPending).toBe(true));
    expect(result.current.settings.data?.name).toBe('Acme');
  });

  it('surfaces the refusal of the rename', async () => {
    const company = companyNamed('Acme');
    const deps = company.composition('refused');
    const { result } = renderHooks(deps);

    await act(async () => {
      result.current.rename.mutate('Nexus');
    });
    await waitFor(() => expect(result.current.rename.isError).toBe(true));

    expect(deps.errorPresenter.present(result.current.rename.error)).toBe(
      i18n.messages.errors.ACCESS_DENIED,
    );
  });

  it('leaves the settings untouched when the rename is refused', async () => {
    const company = companyNamed('Acme');
    const { result } = renderHooks(company.composition('refused'));

    await act(async () => {
      result.current.rename.mutate('Nexus');
    });
    await waitFor(() => expect(result.current.rename.isError).toBe(true));

    expect(result.current.settings.data?.name).toBe('Acme');
  });
});
