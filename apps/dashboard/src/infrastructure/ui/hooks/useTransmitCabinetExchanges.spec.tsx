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
import { useTransmitCabinetExchanges } from './useTransmitCabinetExchanges';

const ready: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.TO_TRANSMIT,
  category: 'Facture',
  document: { fileName: 'a.pdf', mimeType: 'application/pdf', size: 2 },
  senderId: 'u1',
  date: '2026-10-06T09:00:00.000Z',
  consultedAt: null,
};
const received = { ...ready, status: ExchangeStatus.RECEIVED };

const URL = 'companies/c1/cabinet-exchanges/transmission';

function setup(refusal?: ErrorCode) {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/cabinet-exchanges', {
    status: 200,
    data: [ready],
  });
  if (refusal === undefined) {
    http.reply('post', URL, { status: 201, data: [received] });
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
      transmit: useTransmitCabinetExchanges(deps),
    }),
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    },
  );
  return { http, deps, ...rendered };
}

describe('useTransmitCabinetExchanges', () => {
  it('hands the exchanges to transmit to the api', async () => {
    const { http, result } = setup();

    await act(async () => {
      await result.current.transmit.mutateAsync(['ex-1']);
    });

    expect(http.calls.find((call) => call.url === URL)?.data).toEqual({
      exchangeIds: ['ex-1'],
    });
  });

  it('refreshes the list once the exchanges are transmitted', async () => {
    const { http, result } = setup();
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));
    http.reply('get', 'companies/c1/cabinet-exchanges', {
      status: 200,
      data: [received],
    });

    await act(async () => {
      await result.current.transmit.mutateAsync(['ex-1']);
    });

    await waitFor(() =>
      expect(result.current.list.data?.[0]?.status).toBe('Reçu'),
    );
  });

  it('surfaces a failed transmission, which can be retried', async () => {
    const { deps, result } = setup(ErrorCode.TRANSMISSION_FAILED);

    await act(async () => {
      result.current.transmit.mutate(['ex-1']);
    });
    await waitFor(() => expect(result.current.transmit.isError).toBe(true));

    expect(deps.errorPresenter.present(result.current.transmit.error)).toBe(
      i18n.messages.errors.TRANSMISSION_FAILED,
    );
  });
});
