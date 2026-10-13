import { describe, expect, it } from 'vitest';
import {
  CabinetExchangeSnapshot,
  ExchangeDirection,
  ExchangeStatus,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryHttpClient } from '../http/in-memory-http-client';
import { ApiCabinetExchangeGateway } from './api-cabinet-exchange.gateway';

const snapshot: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.DRAFT,
  category: 'Facture',
  document: { fileName: 'a.pdf', mimeType: 'application/pdf', size: 2 },
  senderId: 'user-1',
  date: '2026-10-06T09:00:00.000Z',
  consultedAt: null,
};

const historyEntry = {
  exchangeId: 'ex-1',
  kind: 'TRANSMITTED',
  actorRole: 'EMPLOYER',
  occurredAt: '2026-10-06T10:00:00.000Z',
  documentCount: 5,
  direction: 'COMPANY_TO_CABINET',
  fileName: 'a.pdf',
};

const authorized = { headers: { Authorization: 'Bearer token' } };

const file = {
  fileName: 'a.pdf',
  mimeType: 'application/pdf',
  content: new Uint8Array([72, 105]),
};

describe('ApiCabinetExchangeGateway', () => {
  it('creates a draft, sending the file as base64 text', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/cabinet-exchanges', {
      status: 201,
      data: snapshot,
    });

    await expect(
      new ApiCabinetExchangeGateway(http).createDraft(
        'c1',
        { category: 'Facture', file },
        'token',
      ),
    ).resolves.toEqual(snapshot);
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/cabinet-exchanges',
        data: {
          category: 'Facture',
          file: {
            fileName: 'a.pdf',
            mimeType: 'application/pdf',
            contentBase64: 'SGk=',
          },
        },
        config: authorized,
      },
    ]);
  });

  it('creates a draft without file nor category', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/cabinet-exchanges', {
      status: 201,
      data: snapshot,
    });

    await new ApiCabinetExchangeGateway(http).createDraft('c1', {}, 'token');

    expect(http.calls[0]?.data).toEqual({ category: null, file: null });
  });

  it('marks an exchange To transmit', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/cabinet-exchanges/ex-1/to-transmit', {
      status: 200,
      data: snapshot,
    });

    await expect(
      new ApiCabinetExchangeGateway(http).markToTransmit(
        'c1',
        'ex-1',
        { category: 'Facture' },
        'token',
      ),
    ).resolves.toEqual(snapshot);
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/cabinet-exchanges/ex-1/to-transmit',
        data: { category: 'Facture', file: null },
        config: authorized,
      },
    ]);
  });

  it('transmits a group of exchanges', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/cabinet-exchanges/transmission', {
      status: 200,
      data: [snapshot],
    });

    await expect(
      new ApiCabinetExchangeGateway(http).transmit(
        'c1',
        ['ex-1', 'ex-2'],
        'token',
      ),
    ).resolves.toEqual([snapshot]);
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/cabinet-exchanges/transmission',
        data: { exchangeIds: ['ex-1', 'ex-2'] },
        config: authorized,
      },
    ]);
  });

  it('lists the exchanges of the company', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/cabinet-exchanges', {
      status: 200,
      data: [snapshot],
    });

    await expect(
      new ApiCabinetExchangeGateway(http).list('c1', {}, 'token'),
    ).resolves.toEqual([snapshot]);
    expect(http.calls).toEqual([
      {
        method: 'get',
        url: 'companies/c1/cabinet-exchanges',
        data: undefined,
        config: authorized,
      },
    ]);
  });

  it('lets a refusal of the API through', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'post',
      'companies/c1/cabinet-exchanges/transmission',
      new Error('TRANSMISSION_FAILED'),
    );

    await expect(
      new ApiCabinetExchangeGateway(http).transmit('c1', ['ex-1'], 'token'),
    ).rejects.toThrow('TRANSMISSION_FAILED');
  });

  it('opens an exchange, which consults it', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/cabinet-exchanges/ex-1/consultation', {
      status: 201,
      data: snapshot,
    });

    await expect(
      new ApiCabinetExchangeGateway(http).open('c1', 'ex-1', 'token'),
    ).resolves.toEqual(snapshot);
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/cabinet-exchanges/ex-1/consultation',
        data: undefined,
        config: authorized,
      },
    ]);
  });

  it('downloads the file of an exchange, decoding its base64 content', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/cabinet-exchanges/ex-1/file', {
      status: 200,
      data: {
        fileName: 'a.pdf',
        mimeType: 'application/pdf',
        contentBase64: 'SGk=',
      },
    });

    await expect(
      new ApiCabinetExchangeGateway(http).download('c1', 'ex-1', 'token'),
    ).resolves.toEqual(file);
    expect(http.calls).toEqual([
      {
        method: 'get',
        url: 'companies/c1/cabinet-exchanges/ex-1/file',
        data: undefined,
        config: authorized,
      },
    ]);
  });

  it('deposits a document for the company, sending the file as base64 text', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/cabinet-exchanges/deposit', {
      status: 201,
      data: snapshot,
    });

    await expect(
      new ApiCabinetExchangeGateway(http).deposit(
        'c1',
        { category: 'Bilan', file },
        'token',
      ),
    ).resolves.toEqual(snapshot);
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/cabinet-exchanges/deposit',
        data: {
          category: 'Bilan',
          file: {
            fileName: 'a.pdf',
            mimeType: 'application/pdf',
            contentBase64: 'SGk=',
          },
        },
        config: authorized,
      },
    ]);
  });

  it('reads the history of all the exchanges', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/cabinet-exchanges/history', {
      status: 200,
      data: [historyEntry],
    });

    await expect(
      new ApiCabinetExchangeGateway(http).history('c1', null, 'token'),
    ).resolves.toEqual([historyEntry]);
    expect(http.calls).toEqual([
      {
        method: 'get',
        url: 'companies/c1/cabinet-exchanges/history',
        data: undefined,
        config: authorized,
      },
    ]);
  });

  it('reads the history of one exchange', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/cabinet-exchanges/ex-1/history', {
      status: 200,
      data: [historyEntry],
    });

    await expect(
      new ApiCabinetExchangeGateway(http).history('c1', 'ex-1', 'token'),
    ).resolves.toEqual([historyEntry]);
  });

  it('asks for the filtered exchanges, without sending the empty filters', async () => {
    const http = new InMemoryHttpClient();
    const url =
      'companies/c1/cabinet-exchanges?category=Facture&from=2026-10-01&to=2026-10-31&direction=COMPANY_TO_CABINET&status=RECEIVED';
    http.reply('get', url, { status: 200, data: [snapshot] });
    http.reply('get', 'companies/c1/cabinet-exchanges?status=DRAFT', {
      status: 200,
      data: [],
    });
    const gateway = new ApiCabinetExchangeGateway(http);

    await gateway.list(
      'c1',
      {
        category: 'Facture',
        from: '2026-10-01',
        to: '2026-10-31',
        direction: 'COMPANY_TO_CABINET',
        status: 'RECEIVED',
      },
      'token',
    );
    await gateway.list(
      'c1',
      { category: '', from: null, to: undefined, status: 'DRAFT' },
      'token',
    );

    expect(http.calls.map((call) => call.url)).toEqual([
      url,
      'companies/c1/cabinet-exchanges?status=DRAFT',
    ]);
  });
});
