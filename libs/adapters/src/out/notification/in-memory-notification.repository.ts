import { Notification, UserRole } from '@hexagonal-monorepo-template/domain';
import { INotificationRepository } from '@hexagonal-monorepo-template/ports';

export class InMemoryNotificationRepository implements INotificationRepository {
  constructor(
    private readonly notifications = new Map<string, Notification>(),
  ) {}

  nextId(): string {
    return globalThis.crypto.randomUUID();
  }

  async save(notification: Notification): Promise<void> {
    this.notifications.set(notification.id, notification);
  }

  async listForRole(
    companyId: string,
    role: UserRole,
  ): Promise<readonly Notification[]> {
    return [...this.notifications.values()].filter(
      (notification) =>
        notification.companyId === companyId &&
        notification.recipientRole === role,
    );
  }
}
