import {
  Notification,
  NotificationDraft,
} from '@hexagonal-monorepo-template/domain';

export interface INotificationRepository {
  append(draft: NotificationDraft): Promise<void>;
  listByCompany(companyId: string): Promise<readonly Notification[]>;
}

export const INotificationRepository = Symbol('INotificationRepository');
