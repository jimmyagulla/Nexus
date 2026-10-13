import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  CabinetExchangeSnapshot,
  ExchangeDirection,
  ExchangeStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { createCabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { useListCabinetExchanges } from './useListCabinetExchanges';

const snapshot: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.DRAFT,
  category: 'Facture',
  document: null,
  senderId: 'u1',
  date: '2026-10-06T09:00:00.000Z',
};

function render(reply: unknown) {
  const http = new InMemoryHttpClient();
  if (reply instanceof Error) {
    http.reject('get', 'companies/c1/cabinet-exchanges', reply);
  } else {
    http.reply('get', 'companies/c1/cabinet-exchanges', {
      status: 200,
      data: reply,
    });
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

  return renderHook(() => useListCabinetExchanges(deps), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}

describe('useListCabinetExchanges', () => {
  it('gives the exchanges in the words of the screen', async () => {
    const { result } = render([snapshot]);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      expect.objectContaining({
        id: 'ex-1',
        status: 'Brouillon',
        category: 'Facture',
      }),
    ]);
  });

  it('gives an empty list when nothing was exchanged', async () => {
    const { result } = render([]);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it('reports the refusal of the api', async () => {
    const { result } = render(new Error('ACCESS_DENIED'));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
