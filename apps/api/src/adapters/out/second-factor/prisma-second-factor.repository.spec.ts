import { describe, expect, it } from 'vitest';
import { SecondFactor } from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaSecondFactorRepository } from './prisma-second-factor.repository';
import { PrismaSecondFactorRow } from './prisma-second-factor.mapper';

function createFakePrisma(rows: PrismaSecondFactorRow[] = []) {
  const client = {
    secondFactor: {
      findUnique: async (args: { where: { userId: string } }) =>
        rows.find((row) => row.userId === args.where.userId) ?? null,
      upsert: async (args: {
        where: { userId: string };
        create: PrismaSecondFactorRow;
        update: Partial<PrismaSecondFactorRow>;
      }): Promise<void> => {
        const stored = rows.find((row) => row.userId === args.where.userId);
        if (stored === undefined) {
          rows.push({ ...args.create });
          return;
        }
        Object.assign(stored, args.update);
      },
    },
  };
  return { client: client as unknown as PrismaDb, rows };
}

describe('PrismaSecondFactorRepository', () => {
  it('finds nothing for a user without second factor', async () => {
    const { client } = createFakePrisma();

    expect(
      await new PrismaSecondFactorRepository(client).findByUserId('u1'),
    ).toBeNull();
  });

  it('finds the second factor of a user', async () => {
    const { client } = createFakePrisma([
      {
        userId: 'u1',
        companyId: 'c1',
        secret: 'SECRET',
        enrolled: true,
        recoveryCodeDigests: ['a'],
      },
    ]);

    const factor = await new PrismaSecondFactorRepository(client).findByUserId(
      'u1',
    );

    expect(factor?.secret).toBe('SECRET');
    expect(factor?.isEnrolled()).toBe(true);
    expect(factor?.recoveryCodeDigests).toEqual(['a']);
  });

  it('stores a new second factor', async () => {
    const { client, rows } = createFakePrisma();

    await new PrismaSecondFactorRepository(client).save(
      SecondFactor.begin('u1', 'c1', 'SECRET'),
    );

    expect(rows).toEqual([
      {
        userId: 'u1',
        companyId: 'c1',
        secret: 'SECRET',
        enrolled: false,
        recoveryCodeDigests: [],
      },
    ]);
  });

  it('stores the recovery code digests once confirmed', async () => {
    const { client, rows } = createFakePrisma([
      {
        userId: 'u1',
        companyId: 'c1',
        secret: 'SECRET',
        enrolled: false,
        recoveryCodeDigests: [],
      },
    ]);

    await new PrismaSecondFactorRepository(client).save(
      SecondFactor.begin('u1', 'c1', 'SECRET').confirm(['a', 'b']),
    );

    expect(rows).toEqual([
      {
        userId: 'u1',
        companyId: 'c1',
        secret: 'SECRET',
        enrolled: true,
        recoveryCodeDigests: ['a', 'b'],
      },
    ]);
  });

  it('forgets a recovery code once it is spent', async () => {
    const { client, rows } = createFakePrisma([
      {
        userId: 'u1',
        companyId: 'c1',
        secret: 'SECRET',
        enrolled: true,
        recoveryCodeDigests: ['a', 'b'],
      },
    ]);
    const repository = new PrismaSecondFactorRepository(client);
    const factor = await repository.findByUserId('u1');

    await repository.save(factor!.consumeRecoveryCode('a'));

    expect(rows[0]?.recoveryCodeDigests).toEqual(['b']);
  });
});
