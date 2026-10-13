import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
import { saveFile } from '../lib/save-file';
import { ExchangeDetailPage } from './ExchangeDetailPage';

vi.mock('../lib/save-file', () => ({ saveFile: vi.fn() }));

const consulted: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.CONSULTED,
  category: 'Facture',
  document: { fileName: 'releve.pdf', mimeType: 'application/pdf', size: 2 },
  senderId: 'u1',
  date: '2026-10-06T09:00:00.000Z',
  consultedAt: '2026-10-07T08:00:00.000Z',
};

const BASE = 'companies/c1/cabinet-exchanges/ex-1';

function setup(opened: CabinetExchangeSnapshot | Error) {
  const http = new InMemoryHttpClient();
  if (opened instanceof Error) {
    http.reject('post', `${BASE}/consultation`, opened);
  } else {
    http.reply('post', `${BASE}/consultation`, { status: 201, data: opened });
  }
  http.reply('get', 'companies/c1/cabinet-exchanges', {
    status: 200,
    data: [],
  });
  const deps = createCabinetExchangeComposition(
    http,
    new InMemorySessionGateway('jwt', {
      userId: 'cab-1',
      companyId: 'c1',
      role: UserRole.ACCOUNTANT,
    }),
  );
  const backs: number[] = [];
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <ExchangeDetailPage
        deps={deps}
        exchangeId="ex-1"
        onBack={() => backs.push(1)}
      />
    </QueryClientProvider>,
  );
  return { http, backs };
}

describe('ExchangeDetailPage', () => {
  beforeEach(() => {
    vi.mocked(saveFile).mockClear();
  });

  it('shows a waiting state while the exchange opens', () => {
    setup(consulted);

    expect(screen.getByText(i18n.messages.loading)).toBeTruthy();
  });

  it('opens the exchange, which shows its consultation date', async () => {
    const { http } = setup(consulted);

    expect(
      await screen.findByText(
        `${i18n.messages.cabinet.consultedOn} 07/10/2026`,
      ),
    ).toBeTruthy();
    expect(
      http.calls.some((call) => call.url === `${BASE}/consultation`),
    ).toBe(true);
  });

  it('says the document is not accessible when it is not meant for the actor', async () => {
    setup(new Error(ErrorCode.INACCESSIBLE_DOCUMENT));

    expect(
      await screen.findByText(i18n.messages.errors.INACCESSIBLE_DOCUMENT),
    ).toBeTruthy();
  });

  it('downloads the file on request', async () => {
    const { http } = setup(consulted);
    http.reply('get', `${BASE}/file`, {
      status: 200,
      data: {
        fileName: 'releve.pdf',
        mimeType: 'application/pdf',
        contentBase64: 'SGk=',
      },
    });

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.cabinet.download,
      }),
    );

    await waitFor(() =>
      expect(saveFile).toHaveBeenCalledWith({
        fileName: 'releve.pdf',
        mimeType: 'application/pdf',
        content: new Uint8Array([72, 105]),
      }),
    );
  });

  it('tells why a download failed', async () => {
    const { http } = setup(consulted);
    http.reject(
      'get',
      `${BASE}/file`,
      new Error(ErrorCode.INACCESSIBLE_DOCUMENT),
    );

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.cabinet.download,
      }),
    );

    expect((await screen.findByRole('alert')).textContent).toBe(
      i18n.messages.errors.INACCESSIBLE_DOCUMENT,
    );
  });

  it('goes back to the list', async () => {
    const { backs } = setup(consulted);

    fireEvent.click(
      await screen.findByRole('button', { name: i18n.messages.cabinet.back }),
    );

    expect(backs).toEqual([1]);
  });
});
