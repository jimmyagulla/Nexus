import { describe, expect, it } from 'vitest';
import {
  NotificationDraft,
  NotificationType,
} from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import {
  toNotificationRecord,
  type PrismaNotificationRow,
} from './prisma-notification.mapper';
import { PrismaNotificationRepository } from './prisma-notification.repository';

type CreateData = ReturnType<typeof toNotificationRecord>;

function createFakePrisma() {
  const rows: PrismaNotificationRow[] = [];
  const creates: CreateData[] = [];
  const client = {
    notification: {
      create: async (args: { data: CreateData }) => {
        creates.push(args.data);
        rows.push({ id: `notification-${rows.length + 1}`, ...args.data });
      },
      findMany: async (args: { where: { companyId: string } }) =>
        rows.filter((row) => row.companyId === args.where.companyId),
    },
  };
  return { client: client as unknown as PrismaDb, creates };
}

function draft(companyId: string): NotificationDraft {
  return {
    type: NotificationType.EXPENSE_REPORT_SUBMITTED,
    recipient: { kind: 'EMPLOYERS' },
    companyId,
    target: { kind: 'EXPENSE_REPORT', id: 'r1' },
    createdAt: new Date('2026-10-06T10:00:00.000Z'),
    read: false,
  };
}

describe('PrismaNotificationRepository', () => {
  it('lets the database assign the id of a new notification', async () => {
    const { client, creates } = createFakePrisma();
    const repository = new PrismaNotificationRepository(client);

    await repository.append(draft('c1'));
    const [notification] = await repository.listByCompany('c1');

    expect(creates).toEqual([toNotificationRecord(draft('c1'))]);
    expect(notification).toEqual({ id: 'notification-1', ...draft('c1') });
  });

  it('lists the notifications of the company only', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaNotificationRepository(client);
    await repository.append(draft('c1'));
    await repository.append(draft('c2'));

    expect(await repository.listByCompany('c1')).toHaveLength(1);
  });
});
