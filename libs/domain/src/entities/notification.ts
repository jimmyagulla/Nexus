import { UserRole } from '../identity/user-role';
import { recipientRoleOf } from '../services/is-recipient';
import { CabinetExchange } from './cabinet-exchange';
import { NotificationType } from './notification-type';

export class Notification {
  constructor(
    readonly id: string,
    readonly type: NotificationType,
    readonly companyId: string,
    readonly recipientRole: UserRole,
    readonly targetId: string,
    readonly createdAt: Date,
    readonly readAt: Date | null,
  ) {}

  /** The recipient of an exchange is told once it becomes Received. */
  static exchangeReceived(
    id: string,
    exchange: CabinetExchange,
    createdAt: Date,
  ): Notification {
    return new Notification(
      id,
      NotificationType.CABINET_DOCUMENT_RECEIVED,
      exchange.companyId,
      recipientRoleOf(exchange),
      exchange.id,
      createdAt,
      null,
    );
  }
}
