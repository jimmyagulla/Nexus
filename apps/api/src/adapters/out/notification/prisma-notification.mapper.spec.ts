import { describe, expect, it } from 'vitest';
import {
  NotificationDraft,
  NotificationType,
} from '@hexagonal-monorepo-template/domain';
import {
  toNotification,
  toNotificationRecord,
} from './prisma-notification.mapper';

const at = new Date('2026-10-06T10:00:00.000Z');

const toEmployers: NotificationDraft = {
  type: NotificationType.EXPENSE_REPORT_SUBMITTED,
  recipient: { kind: 'EMPLOYERS' },
  companyId: 'c1',
  target: { kind: 'EXPENSE_REPORT', id: 'r1' },
  createdAt: at,
  read: false,
};

const toEmployee: NotificationDraft = {
  ...toEmployers,
  type: NotificationType.EXPENSE_REPORT_VALIDATED,
  recipient: { kind: 'USER', userId: 'e1' },
};

describe('prisma notification mapper', () => {
  it('turns a notification for the employers into a flat record', () => {
    expect(toNotificationRecord(toEmployers)).toEqual({
      companyId: 'c1',
      type: 'note.soumise',
      recipientUserId: null,
      recipientEmployers: true,
      targetKind: 'EXPENSE_REPORT',
      targetId: 'r1',
      createdAt: at,
      read: false,
    });
  });

  it('turns a notification for one user into a flat record', () => {
    expect(toNotificationRecord(toEmployee)).toMatchObject({
      type: 'note.validee',
      recipientUserId: 'e1',
      recipientEmployers: false,
    });
  });

  it('rebuilds a notification for the employers', () => {
    expect(
      toNotification({
        id: 'n1',
        ...toNotificationRecord(toEmployers),
      }),
    ).toEqual({ id: 'n1', ...toEmployers });
  });

  it('rebuilds a notification for one user', () => {
    expect(
      toNotification({
        id: 'n2',
        ...toNotificationRecord(toEmployee),
      }),
    ).toEqual({ id: 'n2', ...toEmployee });
  });
});
