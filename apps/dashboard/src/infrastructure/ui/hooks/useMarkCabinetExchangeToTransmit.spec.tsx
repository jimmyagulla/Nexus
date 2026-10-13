import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  CabinetExchangeSnapshot,
  ErrorCode,
  ExchangeDirection,
  ExchangeStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { createCabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { i18n } from '../i18n/i18n';
import { useListCabinetExchanges } from './useListCabinetExchanges';
import { useMarkCabinetExchangeToTransmit } from './useMarkCabinetExchangeToTransmit';

const draft: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.DRAFT,
  category: 'Facture',
  document: { fileName: 'a.pdf', mimeType: 'application/pdf', size: 2 },
  senderId: 'u1',
  date: '2026-10-06T09:00:00.000Z',
};
const ready = { ...draft, status: ExchangeStatus.TO_TRANSMIT };

const URL = 'companies/c1/cabinet-exchanges/ex-1/to-transmit';

function setup(refusal?: ErrorCode) {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/cabinet-exchanges', {
    status: 200,
    data: [draft],
  });
  if (refusal === undefined) {
    http.reply('post', URL, { status: 201, data: ready });
  } else {
    http.reject('post', URL, new Error(refusal));
  }
  const deps = createCabinetExchangeComposition(
    http,
    new InMemorySessionGateway('jwt', {
      userId: 'u1',
      companyId: 'c1',
      role: UserRole.EMPLOYER,
    }),
  );
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const rendered = renderHook(
    () => ({
      list: useListCabinetExchanges(deps),
      mark: useMarkCabinetExchangeToTransmit(deps),
    }),
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    },
  );
  return { http, deps, ...rendered };
}

describe('useMarkCabinetExchangeToTransmit', () => {
  it('asks the api to mark the exchange', async () => {
    const { http, result } = setup();

    await act(async () => {
      await result.current.mark.mutateAsync('ex-1');
    });

    expect(http.calls.some((call) => call.url === URL)).toBe(true);
  });

  it('refreshes the list once the exchange is marked', async () => {
    const { http, result } = setup();
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));
    http.reply('get', 'companies/c1/cabinet-exchanges', {
      status: 200,
      data: [ready],
    });

    await act(async () => {
      await result.current.mark.mutateAsync('ex-1');
    });

    await waitFor(() =>
      expect(result.current.list.data?.[0]?.status).toBe('À transmettre'),
    );
  });

  it('surfaces the refusal of an exchange without document', async () => {
    const { deps, result } = setup(ErrorCode.MISSING_DOCUMENT);

    await act(async () => {
      result.current.mark.mutate('ex-1');
    });
    await waitFor(() => expect(result.current.mark.isError).toBe(true));

    expect(deps.errorPresenter.present(result.current.mark.error)).toBe(
      i18n.messages.errors.MISSING_DOCUMENT,
    );
  });
});
