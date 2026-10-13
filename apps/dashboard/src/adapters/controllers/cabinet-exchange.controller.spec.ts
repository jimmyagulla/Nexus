import { describe, expect, it } from 'vitest';
import {
  CabinetExchangeSnapshot,
  ExchangeDirection,
  ExchangeFileInput,
  ExchangeStatus,
} from '@hexagonal-monorepo-template/domain';
import { CabinetExchangeController } from './cabinet-exchange.controller';

const snapshot: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.DRAFT,
  category: 'Facture',
  document: null,
  senderId: 'user-1',
  date: '2026-10-06T09:00:00.000Z',
  consultedAt: null,
};

const file: ExchangeFileInput = {
  fileName: 'a.pdf',
  mimeType: 'application/pdf',
  content: new Uint8Array([1]),
};

function controller() {
  const received = {
    created: [] as unknown[],
    marked: [] as unknown[],
    transmitted: [] as (readonly string[])[],
    opened: [] as string[],
    downloaded: [] as string[],
    deposited: [] as unknown[],
    histories: [] as (string | null | undefined)[],
    listed: [] as unknown[],
  };
  return {
    received,
    controller: new CabinetExchangeController(
      {
        execute: async (input) => {
          received.created.push(input);
          return snapshot;
        },
      },
      {
        execute: async (input) => {
          received.marked.push(input);
          return { ...snapshot, status: ExchangeStatus.TO_TRANSMIT };
        },
      },
      {
        execute: async (ids) => {
          received.transmitted.push(ids);
          return [{ ...snapshot, status: ExchangeStatus.RECEIVED }];
        },
      },
      {
        execute: async (filters) => {
          received.listed.push(filters);
          return [snapshot];
        },
      },
      {
        execute: async (id) => {
          received.opened.push(id);
          return { ...snapshot, status: ExchangeStatus.CONSULTED };
        },
      },
      {
        execute: async (id) => {
          received.downloaded.push(id);
          return file;
        },
      },
      {
        execute: async (input) => {
          received.deposited.push(input);
          return { ...snapshot, status: ExchangeStatus.RECEIVED };
        },
      },
      {
        execute: async (id) => {
          received.histories.push(id);
          return [];
        },
      },
    ),
  };
}

describe('CabinetExchangeController', () => {
  it('creates a draft from the entered category and file', async () => {
    const { controller: sut, received } = controller();

    await expect(
      sut.createDraft({ category: 'Facture', file }),
    ).resolves.toEqual(snapshot);
    expect(received.created).toEqual([{ category: 'Facture', file }]);
  });

  it('marks an exchange as ready to transmit', async () => {
    const { controller: sut, received } = controller();

    await expect(sut.markToTransmit('ex-1')).resolves.toMatchObject({
      status: ExchangeStatus.TO_TRANSMIT,
    });
    expect(received.marked).toEqual([{ exchangeId: 'ex-1' }]);
  });

  it('transmits several exchanges together', async () => {
    const { controller: sut, received } = controller();

    await expect(sut.transmit(['ex-1', 'ex-2'])).resolves.toEqual([
      expect.objectContaining({ status: ExchangeStatus.RECEIVED }),
    ]);
    expect(received.transmitted).toEqual([['ex-1', 'ex-2']]);
  });

  it('lists the exchanges of the session company', async () => {
    const { controller: sut } = controller();

    await expect(sut.list()).resolves.toEqual([snapshot]);
  });

  it('opens an exchange, which consults it', async () => {
    const { controller: sut, received } = controller();

    await expect(sut.open('ex-1')).resolves.toMatchObject({
      status: ExchangeStatus.CONSULTED,
    });
    expect(received.opened).toEqual(['ex-1']);
  });

  it('downloads the file of an exchange', async () => {
    const { controller: sut, received } = controller();

    await expect(sut.download('ex-1')).resolves.toEqual(file);
    expect(received.downloaded).toEqual(['ex-1']);
  });

  it('deposits a document for the company', async () => {
    const { controller: sut, received } = controller();

    await expect(
      sut.deposit({ category: 'Bilan', file }),
    ).resolves.toMatchObject({ status: ExchangeStatus.RECEIVED });
    expect(received.deposited).toEqual([{ category: 'Bilan', file }]);
  });

  it('reads the history of all the exchanges', async () => {
    const { controller: sut, received } = controller();

    await expect(sut.history()).resolves.toEqual([]);
    expect(received.histories).toEqual([null]);
  });

  it('reads the history of one exchange', async () => {
    const { controller: sut, received } = controller();

    await sut.history('ex-1');

    expect(received.histories).toEqual(['ex-1']);
  });

  it('lists the exchanges matching the filters', async () => {
    const { controller: sut, received } = controller();

    await sut.list({ category: 'Facture', status: 'RECEIVED' });

    expect(received.listed).toEqual([
      { category: 'Facture', status: 'RECEIVED' },
    ]);
  });

  it('lists everything when no filter is given', async () => {
    const { controller: sut, received } = controller();

    await sut.list();

    expect(received.listed).toEqual([{}]);
  });
});
