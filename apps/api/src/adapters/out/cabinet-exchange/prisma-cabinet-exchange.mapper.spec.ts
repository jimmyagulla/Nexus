import { describe, expect, it } from 'vitest';
import {
  CabinetExchange,
  ExchangeCategory,
  ExchangeFile,
} from '@hexagonal-monorepo-template/domain';
import {
  toCabinetExchange,
  toCabinetExchangeData,
} from './prisma-cabinet-exchange.mapper';

const created = new Date('2026-10-06T09:00:00.000Z');
const sent = new Date('2026-10-06T10:00:00.000Z');

function delivered(): CabinetExchange {
  return CabinetExchange.draft('ex-1', 'c1', 'user-1', created)
    .withCategory(ExchangeCategory.parse('Facture'))
    .withDocument(
      ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array([1, 2])),
    )
    .markToTransmit()
    .transmit('user-1', sent, 2)
    .receive(sent);
}

describe('prisma cabinet exchange mapper', () => {
  it('flattens an exchange into one row and its ordered events', () => {
    const data = toCabinetExchangeData(delivered());

    expect(data.row).toEqual({
      id: 'ex-1',
      companyId: 'c1',
      direction: 'COMPANY_TO_CABINET',
      senderId: 'user-1',
      createdAt: created,
      category: 'Facture',
      fileName: 'a.pdf',
      mimeType: 'application/pdf',
      fileSize: 2,
      status: 'RECEIVED',
    });
    expect(data.events).toEqual([
      {
        position: 0,
        kind: 'TRANSMITTED',
        actorId: 'user-1',
        occurredAt: sent,
        documentCount: 2,
      },
      {
        position: 1,
        kind: 'RECEIVED',
        actorId: null,
        occurredAt: sent,
        documentCount: 1,
      },
    ]);
  });

  it('writes an exchange without category nor document as null columns', () => {
    const { row } = toCabinetExchangeData(
      CabinetExchange.draft('ex-2', 'c1', 'user-1', created),
    );

    expect(row).toMatchObject({
      category: null,
      fileName: null,
      mimeType: null,
      fileSize: null,
    });
  });

  it('rebuilds the exchange from what it flattened', () => {
    const data = toCabinetExchangeData(delivered());

    expect(toCabinetExchange({ ...data.row, events: data.events })).toEqual(
      delivered(),
    );
  });

  it('rebuilds a draft without document', () => {
    const draft = CabinetExchange.draft('ex-2', 'c1', 'user-1', created);
    const data = toCabinetExchangeData(draft);

    expect(toCabinetExchange({ ...data.row, events: data.events })).toEqual(
      draft,
    );
  });

  it('reads the events in their recorded order whatever the row order', () => {
    const data = toCabinetExchangeData(delivered());

    const rebuilt = toCabinetExchange({
      ...data.row,
      events: [...data.events].reverse(),
    });

    expect(rebuilt.history.map((event) => event.kind)).toEqual([
      'TRANSMITTED',
      'RECEIVED',
    ]);
  });
});
