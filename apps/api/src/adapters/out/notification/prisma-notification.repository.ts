import {
  Notification,
  NotificationType,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { INotificationRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';

export class PrismaNotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaDb) {}

  nextId(): string {
    return globalThis.crypto.randomUUID();
  }

  async save(notification: Notification): Promise<void> {
    const { id, ...changes } = this.toRow(notification);
    await this.prisma.notification.upsert({
      where: { id },
      create: { id, ...changes },
      update: changes,
    });
  }

  async listForRole(
    companyId: string,
    role: UserRole,
  ): Promise<readonly Notification[]> {
    const rows = await this.prisma.notification.findMany({
      where: { companyId, recipientRole: role },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(
      (row) =>
        new Notification(
          row.id,
          row.type as NotificationType,
          row.companyId,
          row.recipientRole,
          row.targetId,
          row.createdAt,
          row.readAt,
        ),
    );
  }

  private toRow(notification: Notification) {
    return {
      id: notification.id,
      type: notification.type,
      companyId: notification.companyId,
      recipientRole: notification.recipientRole,
      targetId: notification.targetId,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    };
  }
}
