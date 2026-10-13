import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ExchangeDirection,
  ExchangeEventKind,
  ExchangeHistoryEntry,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { createCabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { useCabinetExchangeHistory } from './useCabinetExchangeHistory';

const entry: ExchangeHistoryEntry = {
  exchangeId: 'ex-1',
  kind: ExchangeEventKind.TRANSMITTED,
  actorRole: UserRole.EMPLOYER,
  occurredAt: '2026-10-06T10:05:00.000Z',
  documentCount: 1,
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  fileName: 'a.pdf',
};

function render(exchangeId?: string) {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/cabinet-exchanges/history', {
    status: 200,
    data: [entry, { ...entry, exchangeId: 'ex-2' }],
  });
  http.reply('get', 'companies/c1/cabinet-exchanges/ex-1/history', {
    status: 200,
    data: [entry],
  });
  const deps = createCabinetExchangeComposition(
    http,
    new InMemorySessionGateway('jwt', {
      userId: 'cab-1',
      companyId: 'c1',
      role: UserRole.ACCOUNTANT,
    }),
  );
  return renderHook(() => useCabinetExchangeHistory(deps, exchangeId), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
      >
        {children}
      </QueryClientProvider>
    ),
  });
}

describe('useCabinetExchangeHistory', () => {
  it('reads the history of all the exchanges in the words of the screen', async () => {
    const { result } = render();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0]).toMatchObject({
      who: 'Employeur',
      phrase: 'Le document a été transmis au cabinet comptable.',
      when: '06/10/2026 10:05',
    });
  });

  it('reads the history of one exchange only', async () => {
    const { result } = render('ex-1');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(1);
  });
});
