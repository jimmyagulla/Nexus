import { Notification, NotificationDraft } from '@hexagonal-monorepo-template/domain';
import { INotificationRepository } from '@hexagonal-monorepo-template/ports';

export class InMemoryNotificationRepository implements INotificationRepository {
  constructor(
    private readonly notifications = new Map<string, Notification>(),
  ) {}

  async append(draft: NotificationDraft): Promise<void> {
    const notification: Notification = {
      ...draft,
      id: globalThis.crypto.randomUUID(),
    };
    this.notifications.set(notification.id, notification);
  }

  async listByCompany(companyId: string): Promise<readonly Notification[]> {
    return [...this.notifications.values()].filter(
      (notification) => notification.companyId === companyId,
    );
  }
}
