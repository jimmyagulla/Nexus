import { describe, expect, it } from 'vitest';
import {
  ErrorCode,
  Presence,
  PresenceMonth,
} from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaPresenceRepository } from './prisma-presence.repository';

type PresenceRow = {
  id: string;
  companyId: string;
  employeeId: string;
  month: string;
  proposedWorkedDays: number;
  workedDays: number;
};

type AdjustmentRow = {
  presenceId: string;
  actorId: string;
  occurredAt: Date;
  before: number;
  after: number;
};

type Store = { presences: PresenceRow[]; adjustments: AdjustmentRow[] };

type PresenceCreateData = Omit<PresenceRow, 'id'>;

type FakePrisma = {
  client: PrismaDb;
  store: Store;
  creates: PresenceCreateData[];
};

const october = PresenceMonth.parse('2026-10');
const at = new Date('2026-10-13T09:00:00.000Z');

function row(overrides: Partial<PresenceRow> = {}): PresenceRow {
  return {
    id: 'p1',
    companyId: 'c1',
    employeeId: 'e1',
    month: '2026-10',
    proposedWorkedDays: 22,
    workedDays: 22,
    ...overrides,
  };
}

function readPresence(store: Store, found: PresenceRow | undefined) {
  if (found === undefined) {
    return null;
  }

  return {
    ...found,
    adjustments: store.adjustments
      .filter((adjustment) => adjustment.presenceId === found.id)
      .map((adjustment) => ({ ...adjustment })),
  };
}

function writersOn(target: Store, rejectAdjustments: boolean) {
  return {
    presence: {
      update: async (args: {
        where: { id: string };
        data: { workedDays: number };
      }): Promise<void> => {
        const stored = target.presences.find((item) => item.id === args.where.id);
        if (stored !== undefined) {
          stored.workedDays = args.data.workedDays;
        }
      },
    },
    presenceAdjustment: {
      deleteMany: async (args: {
        where: { presenceId: string };
      }): Promise<void> => {
        target.adjustments = target.adjustments.filter(
          (item) => item.presenceId !== args.where.presenceId,
        );
      },
      createMany: async (args: { data: AdjustmentRow[] }): Promise<void> => {
        if (rejectAdjustments) {
          throw new Error('adjustment write rejected');
        }
        target.adjustments.push(...args.data);
      },
    },
  };
}

type TransactionClient = ReturnType<typeof writersOn>;

function createFakePrisma(
  seed: Partial<Store> = {},
  options: { rejectAdjustments?: boolean } = {},
): FakePrisma {
  const store: Store = { presences: [], adjustments: [], ...seed };
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
      }) => {
        const key = args.where.companyId_employeeId_month;
        return readPresence(
          store,
          store.presences.find(
            (item) =>
              item.companyId === key.companyId &&
              item.employeeId === key.employeeId &&
              item.month === key.month,
          ),
        );
      },
      findFirst: async (args: { where: { id: string; companyId: string } }) =>
        readPresence(
          store,
          store.presences.find(
            (item) =>
              item.id === args.where.id &&
              item.companyId === args.where.companyId,
          ),
        ),
      findMany: async (args: { where: { companyId: string } }) =>
        store.presences
          .filter((item) => item.companyId === args.where.companyId)
          .map((item) => readPresence(store, item)),
      create: async (args: { data: PresenceCreateData }) => {
        const taken = store.presences.some(
          (item) =>
            item.companyId === args.data.companyId &&
            item.employeeId === args.data.employeeId &&
            item.month === args.data.month,
        );
        if (taken) {
          throw Object.assign(new Error('Unique constraint failed'), {
            code: 'P2002',
          });
        }
        creates.push(args.data);
        const created = { id: 'generated-presence-id', ...args.data };
        store.presences.push(created);
        return readPresence(store, created);
      },
    },
    $transaction: async <T>(
      run: (tx: TransactionClient) => Promise<T>,
    ): Promise<T> => {
      const draft = structuredClone(store);
      const result = await run(
        writersOn(draft, options.rejectAdjustments === true),
      );
      Object.assign(store, draft);
      return result;
    },
  };

  return { client: client as unknown as PrismaDb, store, creates };
}

describe('PrismaPresenceRepository', () => {
  it('lets the database assign the id of a new presence', async () => {
    const { client, store, creates } = createFakePrisma();
    const repository = new PrismaPresenceRepository(client);

    const presence = await repository.insert({
      companyId: 'c1',
      employeeId: 'e1',
      month: october,
      workedDays: 22,
    });

    expect(creates).toEqual([
      {
        companyId: 'c1',
        employeeId: 'e1',
        month: '2026-10',
        proposedWorkedDays: 22,
        workedDays: 22,
      },
    ]);
    expect(presence.id).toBe('generated-presence-id');
    expect(presence.month.value).toBe('2026-10');
    expect(store.presences).toHaveLength(1);
  });

  it('keeps the days it was opened with as the proposed ones', async () => {
    const { client } = createFakePrisma();

    const presence = await new PrismaPresenceRepository(client).insert({
      companyId: 'c1',
      employeeId: 'e1',
      month: october,
      workedDays: 22,
    });

    expect(presence.proposedWorkedDays).toBe(22);
    expect(presence.adjustments).toEqual([]);
  });

  it('reports a second presence for the same employee and month as a potential duplicate', async () => {
    const { client, store } = createFakePrisma({ presences: [row()] });

    await expect(
      new PrismaPresenceRepository(client).insert({
        companyId: 'c1',
        employeeId: 'e1',
        month: october,
        workedDays: 20,
      }),
    ).rejects.toThrow(ErrorCode.POTENTIAL_DUPLICATE);
    expect(store.presences).toHaveLength(1);
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

  it('finds the presence of an employee for a month', async () => {
    const { client } = createFakePrisma({ presences: [row()] });

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

  it('finds a presence by its id inside its company', async () => {
    const { client } = createFakePrisma({ presences: [row()] });

    const presence = await new PrismaPresenceRepository(client).findById(
      'c1',
      'p1',
    );

    expect(presence?.id).toBe('p1');
  });

  it('finds nothing by the id of a presence of another company', async () => {
    const { client } = createFakePrisma({ presences: [row()] });

    expect(
      await new PrismaPresenceRepository(client).findById('c2', 'p1'),
    ).toBeNull();
  });

  it('lists the presences of one company only', async () => {
    const { client } = createFakePrisma({
      presences: [row(), row({ id: 'p2', companyId: 'c2', employeeId: 'e9' })],
    });

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

  it('saves the corrected days with their history and reads them back', async () => {
    const { client } = createFakePrisma({ presences: [row()] });
    const repository = new PrismaPresenceRepository(client);
    const presence = (await repository.findById('c1', 'p1')) as Presence;

    await repository.save(presence.adjustWorkedDays(20, 'user-1', at));
    const reloaded = await repository.findById('c1', 'p1');

    expect(reloaded?.workedDays).toBe(20);
    expect(reloaded?.proposedWorkedDays).toBe(22);
    expect(reloaded?.adjustments).toEqual([
      { actorId: 'user-1', occurredAt: at, before: 22, after: 20 },
    ]);
  });

  it('keeps each adjustment once when a presence is saved again', async () => {
    const { client, store } = createFakePrisma({ presences: [row()] });
    const repository = new PrismaPresenceRepository(client);
    const presence = (await repository.findById('c1', 'p1')) as Presence;
    const adjusted = presence.adjustWorkedDays(20, 'user-1', at);

    await repository.save(adjusted);
    await repository.save(adjusted);

    expect(store.adjustments).toHaveLength(1);
  });

  it('keeps the previous state when the history cannot be written', async () => {
    const { client, store } = createFakePrisma(
      { presences: [row()] },
      { rejectAdjustments: true },
    );
    const repository = new PrismaPresenceRepository(client);
    const presence = (await repository.findById('c1', 'p1')) as Presence;

    await expect(
      repository.save(presence.adjustWorkedDays(20, 'user-1', at)),
    ).rejects.toThrow('adjustment write rejected');
    expect(store.presences[0]?.workedDays).toBe(22);
    expect(store.adjustments).toEqual([]);
  });
});
