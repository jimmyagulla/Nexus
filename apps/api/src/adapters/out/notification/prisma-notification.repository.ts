import {
  Notification,
  NotificationDraft,
} from '@hexagonal-monorepo-template/domain';
import { INotificationRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import {
  toNotification,
  toNotificationRecord,
} from './prisma-notification.mapper';

export class PrismaNotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async append(draft: NotificationDraft): Promise<void> {
    await this.prisma.notification.create({ data: toNotificationRecord(draft) });
  }

  async listByCompany(companyId: string): Promise<readonly Notification[]> {
    const rows = await this.prisma.notification.findMany({
      where: { companyId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(toNotification);
  }
}
