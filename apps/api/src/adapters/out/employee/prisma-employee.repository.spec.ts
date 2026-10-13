import { describe, expect, it } from 'vitest';
import { Employee, EmployeeStatus } from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaEmployeeRepository } from './prisma-employee.repository';

type EmployeeRow = {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  status: EmployeeStatus;
  lastActivityAt: Date | null;
};

function createFakePrisma(): { client: PrismaDb; rows: EmployeeRow[] } {
  const rows: EmployeeRow[] = [];

  const client = {
    employee: {
      create: async (args: { data: EmployeeRow }): Promise<void> => {
        rows.push({ ...args.data });
      },
      update: async (args: {
        where: { id: string };
        data: Omit<EmployeeRow, 'id'>;
      }): Promise<void> => {
        const stored = rows.find((row) => row.id === args.where.id);
        if (stored !== undefined) {
          Object.assign(stored, args.data);
        }
      },
      findUnique: async (args: {
        where: { id: string };
      }): Promise<EmployeeRow | null> =>
        rows.find((row) => row.id === args.where.id) ?? null,
    },
  };

  return { client: client as unknown as PrismaDb, rows };
}

function employee(
  id: string,
  status: EmployeeStatus = EmployeeStatus.ACTIVE,
  lastActivityAt: Date | null = null,
): Employee {
  return new Employee(id, 'c1', 'Alice', 'Martin', status, lastActivityAt);
}

describe('PrismaEmployeeRepository', () => {
  it('reads back the record it has just inserted', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaEmployeeRepository(client);
    const alice = employee('e1');

    await repository.insert(alice);

    expect(await repository.findById('e1')).toEqual(alice);
  });

  it('stores the fields of the record', async () => {
    const { client, rows } = createFakePrisma();

    await new PrismaEmployeeRepository(client).insert(employee('e1'));

    expect(rows).toEqual([
      {
        id: 'e1',
        companyId: 'c1',
        firstName: 'Alice',
        lastName: 'Martin',
        status: EmployeeStatus.ACTIVE,
        lastActivityAt: null,
      },
    ]);
  });

  it('returns nothing for an unknown id', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaEmployeeRepository(client);

    await repository.insert(employee('e1'));

    expect(await repository.findById('e2')).toBeNull();
  });

  it('saves the changed record over the stored one', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaEmployeeRepository(client);
    await repository.insert(employee('e1'));
    const at = new Date('2026-10-06T10:00:00.000Z');
    const changed = employee('e1', EmployeeStatus.INACTIVE, at);

    await repository.save(changed);

    expect(await repository.findById('e1')).toEqual(changed);
  });
});
