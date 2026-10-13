import { describe, expect, it } from 'vitest';
import { EmployeeStatus } from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaEmployeeRepository } from './prisma-employee.repository';

type EmployeeRow = { id: string; companyId: string; status: EmployeeStatus };

function createFakePrisma(rows: EmployeeRow[]): PrismaDb {
  return {
    employee: {
      findFirst: async (args: {
        where: { id: string; companyId: string };
      }): Promise<EmployeeRow | null> =>
        rows.find(
          (row) =>
            row.id === args.where.id && row.companyId === args.where.companyId,
        ) ?? null,
    },
  } as unknown as PrismaDb;
}

describe('PrismaEmployeeRepository', () => {
  it('finds an active employee of the company', async () => {
    const repository = new PrismaEmployeeRepository(
      createFakePrisma([
        { id: 'e1', companyId: 'c1', status: EmployeeStatus.ACTIVE },
      ]),
    );

    const employee = await repository.findById('c1', 'e1');

    expect(employee?.id).toBe('e1');
    expect(employee?.companyId).toBe('c1');
    expect(employee?.isActive()).toBe(true);
  });

  it('finds an inactive employee as inactive', async () => {
    const repository = new PrismaEmployeeRepository(
      createFakePrisma([
        { id: 'e1', companyId: 'c1', status: EmployeeStatus.INACTIVE },
      ]),
    );

    expect((await repository.findById('c1', 'e1'))?.isActive()).toBe(false);
  });

  it('does not find an employee of another company', async () => {
    const repository = new PrismaEmployeeRepository(
      createFakePrisma([
        { id: 'e1', companyId: 'c1', status: EmployeeStatus.ACTIVE },
      ]),
    );

    await expect(repository.findById('c2', 'e1')).resolves.toBeNull();
  });
});
