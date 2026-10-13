import { describe, expect, it } from 'vitest';
import { ErrorCode, PresenceMonth } from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaPresenceRepository } from './prisma-presence.repository';

type PresenceRow = {
  id: string;
  companyId: string;
  employeeId: string;
  month: string;
  workedDays: number;
};

type PresenceCreateData = Omit<PresenceRow, 'id'>;

type FakePrisma = {
  client: PrismaDb;
  rows: PresenceRow[];
  creates: PresenceCreateData[];
};

function createFakePrisma(seed: PresenceRow[] = []): FakePrisma {
  const rows = [...seed];
  const creates: PresenceCreateData[] = [];

  const client = {
    presence: {
      findUnique: async (args: {
        where: {
          companyId_employeeId_month: {
            companyId: string;
            employeeId: string;
            month: string;
          };
        };
      }): Promise<PresenceRow | null> => {
        const key = args.where.companyId_employeeId_month;
        return (
          rows.find(
            (row) =>
              row.companyId === key.companyId &&
              row.employeeId === key.employeeId &&
              row.month === key.month,
          ) ?? null
        );
      },
      findMany: async (args: {
        where: { companyId: string };
      }): Promise<PresenceRow[]> =>
        rows.filter((row) => row.companyId === args.where.companyId),
      create: async (args: { data: PresenceCreateData }) => {
        const taken = rows.some(
          (row) =>
            row.companyId === args.data.companyId &&
            row.employeeId === args.data.employeeId &&
            row.month === args.data.month,
        );
        if (taken) {
          throw Object.assign(new Error('Unique constraint failed'), {
            code: 'P2002',
          });
        }
        creates.push(args.data);
        const row = { id: 'generated-presence-id', ...args.data };
        rows.push(row);
        return row;
      },
    },
  };

  return { client: client as unknown as PrismaDb, rows, creates };
}

const october = PresenceMonth.parse('2026-10');

describe('PrismaPresenceRepository', () => {
  it('lets the database assign the id of a new presence', async () => {
    const { client, rows, creates } = createFakePrisma();
    const repository = new PrismaPresenceRepository(client);

    const presence = await repository.insert({
      companyId: 'c1',
      employeeId: 'e1',
      month: october,
      workedDays: 22,
    });

    expect(creates).toEqual([
      { companyId: 'c1', employeeId: 'e1', month: '2026-10', workedDays: 22 },
    ]);
    expect(presence.id).toBe('generated-presence-id');
    expect(presence.month.value).toBe('2026-10');
    expect(rows).toHaveLength(1);
  });

  it('reports a second presence for the same employee and month as a potential duplicate', async () => {
    const { client, rows } = createFakePrisma([
      {
        id: 'p1',
        companyId: 'c1',
        employeeId: 'e1',
        month: '2026-10',
        workedDays: 22,
      },
    ]);
    const repository = new PrismaPresenceRepository(client);

    await expect(
      repository.insert({
        companyId: 'c1',
        employeeId: 'e1',
        month: october,
        workedDays: 20,
      }),
    ).rejects.toThrow(ErrorCode.POTENTIAL_DUPLICATE);
    expect(rows).toHaveLength(1);
  });

  it('finds the presence of an employee for a month', async () => {
    const { client } = createFakePrisma([
      {
        id: 'p1',
        companyId: 'c1',
        employeeId: 'e1',
        month: '2026-10',
        workedDays: 22,
      },
    ]);

    const presence = await new PrismaPresenceRepository(
      client,
    ).findByEmployeeAndMonth('c1', 'e1', october);

    expect(presence).toMatchObject({
      id: 'p1',
      companyId: 'c1',
      employeeId: 'e1',
      workedDays: 22,
    });
    expect(presence?.month.value).toBe('2026-10');
  });

  it('finds nothing for a month that was never opened', async () => {
    const { client } = createFakePrisma();

    expect(
      await new PrismaPresenceRepository(client).findByEmployeeAndMonth(
        'c1',
        'e1',
        october,
      ),
    ).toBeNull();
  });

  it('lists the presences of one company only', async () => {
    const { client } = createFakePrisma([
      {
        id: 'p1',
        companyId: 'c1',
        employeeId: 'e1',
        month: '2026-10',
        workedDays: 22,
      },
      {
        id: 'p2',
        companyId: 'c2',
        employeeId: 'e9',
        month: '2026-10',
        workedDays: 18,
      },
    ]);

    const presences = await new PrismaPresenceRepository(client).list({
      companyId: 'c1',
    });

    expect(presences.map((presence) => presence.id)).toEqual(['p1']);
  });

  it('lists nothing for a company without presences', async () => {
    const { client } = createFakePrisma();

    expect(
      await new PrismaPresenceRepository(client).list({ companyId: 'c1' }),
    ).toEqual([]);
  });

  it('lets any other database failure through', async () => {
    const client = {
      presence: {
        create: async () => {
          throw new Error('connection lost');
        },
      },
    } as unknown as PrismaDb;

    await expect(
      new PrismaPresenceRepository(client).insert({
        companyId: 'c1',
        employeeId: 'e1',
        month: october,
        workedDays: 22,
      }),
    ).rejects.toThrow('connection lost');
  });
});
