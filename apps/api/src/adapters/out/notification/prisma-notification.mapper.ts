import {
  Notification,
  NotificationDraft,
  NotificationRecipient,
  NotificationType,
} from '@hexagonal-monorepo-template/domain';

export type PrismaNotificationRow = {
  id: string;
  companyId: string;
  type: string;
  recipientUserId: string | null;
  recipientEmployers: boolean;
  targetKind: string;
  targetId: string;
  createdAt: Date;
  read: boolean;
};

export function toNotificationRecord(draft: NotificationDraft) {
  return {
    companyId: draft.companyId,
    type: draft.type,
    recipientUserId:
      draft.recipient.kind === 'USER' ? draft.recipient.userId : null,
    recipientEmployers: draft.recipient.kind === 'EMPLOYERS',
    targetKind: draft.target.kind,
    targetId: draft.target.id,
    createdAt: draft.createdAt,
    read: draft.read,
  };
}

export function toNotification(row: PrismaNotificationRow): Notification {
  return {
    id: row.id,
    type: row.type as NotificationType,
    recipient: toRecipient(row),
    companyId: row.companyId,
    target: { kind: 'EXPENSE_REPORT', id: row.targetId },
    createdAt: row.createdAt,
    read: row.read,
  };
}

function toRecipient(row: PrismaNotificationRow): NotificationRecipient {
  return row.recipientUserId === null
    ? { kind: 'EMPLOYERS' }
    : { kind: 'USER', userId: row.recipientUserId };
}
