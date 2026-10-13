import { describe, expect, it } from 'vitest';
import { ExchangeFile } from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaExchangeFileStorage } from './prisma-exchange-file.storage';

type FileRow = {
  exchangeId: string;
  fileName: string;
  mimeType: string;
  content: Uint8Array;
};

type UpsertArgs = {
  where: { exchangeId: string };
  create: FileRow;
  update: Omit<FileRow, 'exchangeId'>;
};

function createFakePrisma(): { client: PrismaDb; rows: FileRow[] } {
  const rows: FileRow[] = [];
  const client = {
    cabinetExchangeFile: {
      upsert: async (args: UpsertArgs): Promise<void> => {
        const index = rows.findIndex(
          (row) => row.exchangeId === args.where.exchangeId,
        );
        if (index === -1) {
          rows.push({ ...args.create });
          return;
        }
        rows[index] = { ...rows[index]!, ...args.update };
      },
      findUnique: async (args: { where: { exchangeId: string } }) =>
        rows.find((row) => row.exchangeId === args.where.exchangeId) ?? null,
    },
  };
  return { client: client as unknown as PrismaDb, rows };
}

const file = (content: number[]): ExchangeFile =>
  ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array(content));

describe('PrismaExchangeFileStorage', () => {
  it('stores the file of an exchange', async () => {
    const { client, rows } = createFakePrisma();

    await new PrismaExchangeFileStorage(client).save('ex-1', file([1, 2]));

    expect(rows).toEqual([
      {
        exchangeId: 'ex-1',
        fileName: 'a.pdf',
        mimeType: 'application/pdf',
        content: new Uint8Array([1, 2]),
      },
    ]);
  });

  it('gives back the stored file', async () => {
    const { client } = createFakePrisma();
    const storage = new PrismaExchangeFileStorage(client);
    await storage.save('ex-1', file([1, 2]));

    const found = await storage.find('ex-1');

    expect(found?.fileName).toBe('a.pdf');
    expect([...(found?.content ?? [])]).toEqual([1, 2]);
  });

  it('replaces the file when it is stored again', async () => {
    const { client, rows } = createFakePrisma();
    const storage = new PrismaExchangeFileStorage(client);
    await storage.save('ex-1', file([1]));

    await storage.save('ex-1', file([9]));

    expect(rows).toHaveLength(1);
    expect([...(rows[0]?.content ?? [])]).toEqual([9]);
  });

  it('finds nothing for an exchange without file', async () => {
    const { client } = createFakePrisma();

    await expect(
      new PrismaExchangeFileStorage(client).find('ex-1'),
    ).resolves.toBeNull();
  });
});
