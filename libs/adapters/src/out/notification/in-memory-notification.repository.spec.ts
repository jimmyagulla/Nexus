import { describe, expect, it } from 'vitest';
import {
  Notification,
  NotificationType,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryNotificationRepository } from './in-memory-notification.repository';

const at = new Date('2026-10-06T10:00:00.000Z');

const notification = (id: string, companyId: string, role: UserRole) =>
  new Notification(
    id,
    NotificationType.CABINET_DOCUMENT_RECEIVED,
    companyId,
    role,
    'ex-1',
    at,
    null,
  );

describe('InMemoryNotificationRepository', () => {
  it('hands out a distinct identity every time', () => {
    const repository = new InMemoryNotificationRepository();

    expect(repository.nextId()).not.toBe(repository.nextId());
  });

  it('lists the notifications of a role in a company', async () => {
    const repository = new InMemoryNotificationRepository();
    const mine = notification('n-1', 'c1', UserRole.ACCOUNTANT);
    await repository.save(mine);

    await expect(
      repository.listForRole('c1', UserRole.ACCOUNTANT),
    ).resolves.toEqual([mine]);
  });

  it('keeps the notifications of other roles and companies apart', async () => {
    const repository = new InMemoryNotificationRepository();
    await repository.save(notification('n-1', 'c1', UserRole.EMPLOYER));
    await repository.save(notification('n-2', 'c2', UserRole.ACCOUNTANT));

    await expect(
      repository.listForRole('c1', UserRole.ACCOUNTANT),
    ).resolves.toEqual([]);
  });

  it('keeps a notification saved twice once', async () => {
    const repository = new InMemoryNotificationRepository();
    await repository.save(notification('n-1', 'c1', UserRole.EMPLOYER));
    await repository.save(notification('n-1', 'c1', UserRole.EMPLOYER));

    await expect(
      repository.listForRole('c1', UserRole.EMPLOYER),
    ).resolves.toHaveLength(1);
  });
});
