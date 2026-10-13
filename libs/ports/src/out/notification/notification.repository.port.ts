import { Notification, UserRole } from '@hexagonal-monorepo-template/domain';

export interface INotificationRepository {
  nextId(): string;
  save(notification: Notification): Promise<void>;
  listForRole(
    companyId: string,
    role: UserRole,
  ): Promise<readonly Notification[]>;
}

export const INotificationRepository = Symbol('INotificationRepository');
