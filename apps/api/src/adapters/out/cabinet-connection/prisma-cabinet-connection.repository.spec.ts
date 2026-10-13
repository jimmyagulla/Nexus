import { describe, expect, it } from 'vitest';
import {
  CabinetConnection,
  CabinetConnectionStatus,
} from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaCabinetConnectionRepository } from './prisma-cabinet-connection.repository';

type ConnectionRow = { companyId: string; status: CabinetConnectionStatus };

type UpsertArgs = {
  where: { companyId: string };
  create: ConnectionRow;
  update: { status: CabinetConnectionStatus };
};

function createFakePrisma(): { client: PrismaDb; rows: ConnectionRow[] } {
  const rows: ConnectionRow[] = [];
  const client = {
    cabinetConnection: {
      upsert: async (args: UpsertArgs): Promise<void> => {
        const stored = rows.find(
          (row) => row.companyId === args.where.companyId,
        );
        if (stored === undefined) {
          rows.push({ ...args.create });
          return;
        }
        stored.status = args.update.status;
      },
      findUnique: async (args: { where: { companyId: string } }) =>
        rows.find((row) => row.companyId === args.where.companyId) ?? null,
    },
  };
  return { client: client as unknown as PrismaDb, rows };
}

describe('PrismaCabinetConnectionRepository', () => {
  it('stores the connection of a company', async () => {
    const { client, rows } = createFakePrisma();

    await new PrismaCabinetConnectionRepository(client).save(
      new CabinetConnection('c1', CabinetConnectionStatus.CONNECTED),
    );

    expect(rows).toEqual([{ companyId: 'c1', status: 'CONNECTED' }]);
  });

  it('finds the connection of a company', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaCabinetConnectionRepository(client);
    const connection = new CabinetConnection(
      'c1',
      CabinetConnectionStatus.REVOKED,
    );
    await repository.save(connection);

    await expect(repository.findByCompanyId('c1')).resolves.toEqual(connection);
  });

  it('keeps one connection per company, with the latest status', async () => {
    const { client, rows } = createFakePrisma();
    const repository = new PrismaCabinetConnectionRepository(client);
    await repository.save(
      new CabinetConnection('c1', CabinetConnectionStatus.INVITATION_SENT),
    );

    await repository.save(
      new CabinetConnection('c1', CabinetConnectionStatus.CONNECTED),
    );

    expect(rows).toEqual([{ companyId: 'c1', status: 'CONNECTED' }]);
  });

  it('finds nothing for a company without cabinet', async () => {
    const { client } = createFakePrisma();

    await expect(
      new PrismaCabinetConnectionRepository(client).findByCompanyId('c1'),
    ).resolves.toBeNull();
  });
});
