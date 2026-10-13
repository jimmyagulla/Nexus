import { describe, expect, it } from 'vitest';
import {
  Notification,
  NotificationType,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaNotificationRepository } from './prisma-notification.repository';

type Row = {
  id: string;
  type: string;
  companyId: string;
  recipientRole: UserRole;
  targetId: string;
  createdAt: Date;
  readAt: Date | null;
};

function createFakePrisma(): { client: PrismaDb; rows: Row[] } {
  const rows: Row[] = [];
  const client = {
    notification: {
      upsert: async (args: {
        where: { id: string };
        create: Row;
        update: Omit<Row, 'id'>;
      }): Promise<void> => {
        const index = rows.findIndex((row) => row.id === args.where.id);
        if (index === -1) {
          rows.push({ ...args.create });
          return;
        }
        rows[index] = { ...rows[index]!, ...args.update };
      },
      findMany: async (args: {
        where: { companyId: string; recipientRole: UserRole };
      }) =>
        rows.filter(
          (row) =>
            row.companyId === args.where.companyId &&
            row.recipientRole === args.where.recipientRole,
        ),
    },
  };
  return { client: client as unknown as PrismaDb, rows };
}

const at = new Date('2026-10-06T10:00:00.000Z');
const notification = new Notification(
  'n-1',
  NotificationType.CABINET_DOCUMENT_RECEIVED,
  'c1',
  UserRole.ACCOUNTANT,
  'ex-1',
  at,
  null,
);

describe('PrismaNotificationRepository', () => {
  it('hands out a distinct identity every time', () => {
    const repository = new PrismaNotificationRepository(
      createFakePrisma().client,
    );

    expect(repository.nextId()).not.toBe(repository.nextId());
  });

  it('stores a notification', async () => {
    const { client, rows } = createFakePrisma();

    await new PrismaNotificationRepository(client).save(notification);

    expect(rows).toEqual([
      {
        id: 'n-1',
        type: 'cabinet.document.recu',
        companyId: 'c1',
        recipientRole: 'ACCOUNTANT',
        targetId: 'ex-1',
        createdAt: at,
        readAt: null,
      },
    ]);
  });

  it('keeps a notification saved twice once', async () => {
    const { client, rows } = createFakePrisma();
    const repository = new PrismaNotificationRepository(client);

    await repository.save(notification);
    await repository.save(notification);

    expect(rows).toHaveLength(1);
  });

  it('lists the notifications of a role in a company', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaNotificationRepository(client);
    await repository.save(notification);

    await expect(
      repository.listForRole('c1', UserRole.ACCOUNTANT),
    ).resolves.toEqual([notification]);
    await expect(
      repository.listForRole('c1', UserRole.EMPLOYER),
    ).resolves.toEqual([]);
  });
});
