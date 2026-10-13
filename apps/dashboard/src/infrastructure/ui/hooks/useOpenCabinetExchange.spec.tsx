import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
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
import {
  listCabinetExchangesQueryKey,
  useListCabinetExchanges,
} from './useListCabinetExchanges';
import { useOpenCabinetExchange } from './useOpenCabinetExchange';

const received: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.RECEIVED,
  category: 'Facture',
  document: { fileName: 'a.pdf', mimeType: 'application/pdf', size: 2 },
  senderId: 'u1',
  date: '2026-10-06T09:00:00.000Z',
  consultedAt: null,
};
const consulted = {
  ...received,
  status: ExchangeStatus.CONSULTED,
  consultedAt: '2026-10-07T08:00:00.000Z',
};

const LIST = 'companies/c1/cabinet-exchanges';
const OPEN = 'companies/c1/cabinet-exchanges/ex-1/consultation';

function setup(opened: CabinetExchangeSnapshot | Error) {
  const http = new InMemoryHttpClient();
  http.reply('get', LIST, { status: 200, data: [received] });
  if (opened instanceof Error) {
    http.reject('post', OPEN, opened);
  } else {
    http.reply('post', OPEN, { status: 201, data: opened });
  }
  const deps = createCabinetExchangeComposition(
    http,
    new InMemorySessionGateway('jwt', {
      userId: 'cab-1',
      companyId: 'c1',
      role: UserRole.ACCOUNTANT,
    }),
  );
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return {
    http,
    client,
    renderList: () =>
      renderHook(() => useListCabinetExchanges(deps), { wrapper }),
    renderOpen: () =>
      renderHook(() => useOpenCabinetExchange(deps, 'ex-1'), { wrapper }),
  };
}

describe('useOpenCabinetExchange', () => {
  it('opens the exchange and gives it in the words of the screen', async () => {
    const { renderOpen } = setup(consulted);
    const { result } = renderOpen();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchObject({
      id: 'ex-1',
      status: 'Consulté',
      consultedOn: '07/10/2026',
    });
  });

  it('refreshes the list, whose status changed', async () => {
    const { http, client, renderList, renderOpen } = setup(consulted);
    const list = renderList();
    await waitFor(() => expect(list.result.current.isSuccess).toBe(true));
    http.reply('get', LIST, { status: 200, data: [consulted] });

    const opened = renderOpen();
    await waitFor(() => expect(opened.result.current.isSuccess).toBe(true));

    await waitFor(() =>
      expect(
        (client.getQueryData(listCabinetExchangesQueryKey()) as { status: string }[])[0]
          ?.status,
      ).toBe('Consulté'),
    );
  });

  it('reports an exchange that is not accessible', async () => {
    const { renderOpen } = setup(new Error(ErrorCode.INACCESSIBLE_DOCUMENT));
    const { result } = renderOpen();

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
