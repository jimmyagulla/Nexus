import { describe, expect, it } from 'vitest';
import {
  CabinetExchange,
  ExchangeCategory,
  ExchangeFile,
} from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import {
  CabinetExchangeEventRow,
  CabinetExchangeRow,
} from './prisma-cabinet-exchange.mapper';
import { PrismaCabinetExchangeRepository } from './prisma-cabinet-exchange.repository';

type StoredRow = CabinetExchangeRow & { events: CabinetExchangeEventRow[] };

type UpsertArgs = {
  where: { id: string };
  create: CabinetExchangeRow & { events: { create: CabinetExchangeEventRow[] } };
  update: Omit<CabinetExchangeRow, 'id'> & {
    events: { deleteMany: object; create: CabinetExchangeEventRow[] };
  };
};

function createFakePrisma(): { client: PrismaDb; rows: StoredRow[] } {
  const rows: StoredRow[] = [];
  const client = {
    cabinetExchange: {
      upsert: async (args: UpsertArgs): Promise<void> => {
        const index = rows.findIndex((row) => row.id === args.where.id);
        if (index === -1) {
          const { events, ...row } = args.create;
          rows.push({ ...row, events: events.create });
          return;
        }
        const { events, ...changes } = args.update;
        rows[index] = { ...rows[index]!, ...changes, events: events.create };
      },
      findUnique: async (args: { where: { id: string } }) =>
        rows.find((row) => row.id === args.where.id) ?? null,
      findMany: async (args: { where: { companyId: string } }) =>
        rows.filter((row) => row.companyId === args.where.companyId),
    },
  };
  return { client: client as unknown as PrismaDb, rows };
}

const created = new Date('2026-10-06T09:00:00.000Z');
const sent = new Date('2026-10-06T10:00:00.000Z');

function delivered(id = 'ex-1', companyId = 'c1'): CabinetExchange {
  return CabinetExchange.draft(id, companyId, 'user-1', created)
    .withCategory(ExchangeCategory.parse('Facture'))
    .withDocument(
      ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array([1])),
    )
    .markToTransmit()
    .transmit('user-1', sent)
    .receive(sent);
}

describe('PrismaCabinetExchangeRepository', () => {
  it('hands out a distinct identity every time', () => {
    const repository = new PrismaCabinetExchangeRepository(
      createFakePrisma().client,
    );

    expect(repository.nextId()).not.toBe(repository.nextId());
  });

  it('stores an exchange together with its history', async () => {
    const { client, rows } = createFakePrisma();

    await new PrismaCabinetExchangeRepository(client).save(delivered());

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ id: 'ex-1', status: 'RECEIVED' });
    expect(rows[0]?.events.map((event) => event.kind)).toEqual([
      'TRANSMITTED',
      'RECEIVED',
    ]);
  });

  it('replaces the stored exchange when it is saved again', async () => {
    const { client, rows } = createFakePrisma();
    const repository = new PrismaCabinetExchangeRepository(client);
    await repository.save(
      CabinetExchange.draft('ex-1', 'c1', 'user-1', created),
    );

    await repository.save(delivered());

    expect(rows).toHaveLength(1);
    expect(rows[0]?.status).toBe('RECEIVED');
  });

  it('finds an exchange by its identity', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaCabinetExchangeRepository(client);
    await repository.save(delivered());

    await expect(repository.findById('ex-1')).resolves.toEqual(delivered());
  });

  it('finds nothing for an unknown identity', async () => {
    const repository = new PrismaCabinetExchangeRepository(
      createFakePrisma().client,
    );

    await expect(repository.findById('ghost')).resolves.toBeNull();
  });

  it('lists only the exchanges of the company', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaCabinetExchangeRepository(client);
    await repository.save(delivered('ex-1', 'c1'));
    await repository.save(delivered('ex-2', 'c2'));

    const listed = await repository.listByCompany('c1');

    expect(listed.map((exchange) => exchange.id)).toEqual(['ex-1']);
  });
});
