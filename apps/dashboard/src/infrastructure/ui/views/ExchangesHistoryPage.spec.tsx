import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ErrorCode,
  ExchangeDirection,
  ExchangeEventKind,
  ExchangeHistoryEntry,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { createCabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { i18n } from '../i18n/i18n';
import { ExchangesHistoryPage } from './ExchangesHistoryPage';

const entry: ExchangeHistoryEntry = {
  exchangeId: 'ex-1',
  kind: ExchangeEventKind.TRANSMITTED,
  actorRole: UserRole.EMPLOYER,
  occurredAt: '2026-10-06T10:05:00.000Z',
  documentCount: 5,
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  fileName: 'a.pdf',
};

const HISTORY = 'companies/c1/cabinet-exchanges/history';

function setup(history: ExchangeHistoryEntry[] | Error) {
  const http = new InMemoryHttpClient();
  if (history instanceof Error) {
    http.reject('get', HISTORY, history);
  } else {
    http.reply('get', HISTORY, { status: 200, data: history });
  }
  const deps = createCabinetExchangeComposition(
    http,
    new InMemorySessionGateway('jwt', {
      userId: 'cab-1',
      companyId: 'c1',
      role: UserRole.ACCOUNTANT,
    }),
  );
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <ExchangesHistoryPage deps={deps} />
    </QueryClientProvider>,
  );
}

describe('ExchangesHistoryPage', () => {
  it('shows a waiting state while the history loads', () => {
    setup([entry]);

    expect(screen.getByText(i18n.messages.loading)).toBeTruthy();
  });

  it('reads a grouped transmission', async () => {
    setup([entry]);

    expect(
      await screen.findByText(
        '5 documents ont été transmis au cabinet comptable.',
      ),
    ).toBeTruthy();
  });

  it('says that nothing was recorded yet', async () => {
    setup([]);

    expect(
      await screen.findByText(i18n.messages.cabinet.historyEmpty),
    ).toBeTruthy();
  });

  it('tells why the history cannot be shown', async () => {
    setup(new Error(ErrorCode.ACCESS_DENIED));

    expect(
      await screen.findByText(i18n.messages.errors.ACCESS_DENIED),
    ).toBeTruthy();
  });
});
