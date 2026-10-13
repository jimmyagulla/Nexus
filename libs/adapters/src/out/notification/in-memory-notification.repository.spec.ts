import { describe, expect, it } from 'vitest';
import {
  NotificationDraft,
  NotificationType,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryNotificationRepository } from './in-memory-notification.repository';

const ASSIGNED_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

describe('InMemoryNotificationRepository', () => {
  it('keeps a notification with an assigned identity', async () => {
    const repository = new InMemoryNotificationRepository();

    await repository.append(draft('c1'));
    const [notification] = await repository.listByCompany('c1');

    expect(notification?.id).toMatch(ASSIGNED_ID);
    expect(notification).toMatchObject(draft('c1'));
  });

  it('lists the notifications of the company only', async () => {
    const repository = new InMemoryNotificationRepository();
    await repository.append(draft('c1'));
    await repository.append(draft('c2'));

    expect(await repository.listByCompany('c1')).toHaveLength(1);
  });

  it('lists nothing for a company without notification', async () => {
    await expect(
      new InMemoryNotificationRepository().listByCompany('c1'),
    ).resolves.toEqual([]);
  });
});
