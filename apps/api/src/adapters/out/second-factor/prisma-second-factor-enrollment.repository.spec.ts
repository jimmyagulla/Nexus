import { describe, expect, it } from 'vitest';
import {
  SecondFactorEnrollment,
  SecondFactorEnrollmentStatus,
} from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaSecondFactorEnrollmentRepository } from './prisma-second-factor-enrollment.repository';

type EnrollmentRow = {
  id: string;
  accountId: string;
  secret: string;
  status: SecondFactorEnrollmentStatus;
};

function createFakePrisma(): { client: PrismaDb; rows: EnrollmentRow[] } {
  const rows: EnrollmentRow[] = [];

  const client = {
    secondFactorEnrollment: {
      create: async (args: { data: EnrollmentRow }): Promise<void> => {
        rows.push({ ...args.data });
      },
      update: async (args: {
        where: { id: string };
        data: Omit<EnrollmentRow, 'id'>;
      }): Promise<void> => {
        const stored = rows.find((row) => row.id === args.where.id);
        if (stored !== undefined) {
          Object.assign(stored, args.data);
        }
      },
      findUnique: async (args: {
        where: { id?: string; accountId?: string };
      }): Promise<EnrollmentRow | null> =>
        rows.find(
          (row) =>
            (args.where.id === undefined || row.id === args.where.id) &&
            (args.where.accountId === undefined ||
              row.accountId === args.where.accountId),
        ) ?? null,
    },
  };

  return { client: client as unknown as PrismaDb, rows };
}

function pending(id: string, accountId: string): SecondFactorEnrollment {
  return SecondFactorEnrollment.start(id, accountId, 'JBSWY3DPEHPK3PXP');
}

describe('PrismaSecondFactorEnrollmentRepository', () => {
  it('reads back the enrollment it has just inserted', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaSecondFactorEnrollmentRepository(client);
    const enrollment = pending('en1', 'a1');

    await repository.insert(enrollment);

    expect(await repository.findById('en1')).toEqual(enrollment);
  });

  it('stores the fields of the enrollment', async () => {
    const { client, rows } = createFakePrisma();

    await new PrismaSecondFactorEnrollmentRepository(client).insert(
      pending('en1', 'a1'),
    );

    expect(rows).toEqual([
      {
        id: 'en1',
        accountId: 'a1',
        secret: 'JBSWY3DPEHPK3PXP',
        status: SecondFactorEnrollmentStatus.PENDING,
      },
    ]);
  });

  it('returns nothing for an unknown id', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaSecondFactorEnrollmentRepository(client);

    await repository.insert(pending('en1', 'a1'));

    expect(await repository.findById('en2')).toBeNull();
  });

  it('reads the enrollment of an account back by that account', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaSecondFactorEnrollmentRepository(client);
    const enrollment = pending('en1', 'a1');

    await repository.insert(pending('en2', 'a2'));
    await repository.insert(enrollment);

    expect(await repository.findByAccountId('a1')).toEqual(enrollment);
  });

  it('returns nothing for an account without enrollment', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaSecondFactorEnrollmentRepository(client);

    await repository.insert(pending('en1', 'a1'));

    expect(await repository.findByAccountId('a2')).toBeNull();
  });

  it('saves the changed enrollment over the stored one', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaSecondFactorEnrollmentRepository(client);
    await repository.insert(pending('en1', 'a1'));
    const confirmed = new SecondFactorEnrollment(
      'en1',
      'a1',
      'JBSWY3DPEHPK3PXP',
      SecondFactorEnrollmentStatus.CONFIRMED,
    );

    await repository.save(confirmed);

    expect(await repository.findById('en1')).toEqual(confirmed);
  });
});
