import { Notification } from '@hexagonal-monorepo-template/domain';
import { AppRoutes } from '../../infrastructure/ui/routes/app-routes';

export interface NotificationTargetViewModel {
  to: typeof AppRoutes.exchange;
  params: { exchangeId: string };
}

export class CabinetNotificationTargetPresenter {
  present(notification: Notification): NotificationTargetViewModel {
    return {
      to: AppRoutes.exchange,
      params: { exchangeId: notification.targetId },
    };
  }
}
