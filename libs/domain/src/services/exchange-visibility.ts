import { CabinetConnection } from '../entities/cabinet-connection';
import { CabinetExchange } from '../entities/cabinet-exchange';
import { ExchangeStatus } from '../entities/exchange-status';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';

const STATUSES_SEEN_BY_RECIPIENT: readonly ExchangeStatus[] = [
  ExchangeStatus.RECEIVED,
  ExchangeStatus.CONSULTED,
];

export function isVisibleTo(
  exchange: CabinetExchange,
  actor: ActorContext,
  connection: CabinetConnection | null,
): boolean {
  if (actor.companyId !== exchange.companyId) {
    return false;
  }
  if (actor.role === UserRole.EMPLOYER) {
    return (
      exchange.status !== ExchangeStatus.DRAFT ||
      exchange.senderId === actor.userId
    );
  }
  if (actor.role === UserRole.ACCOUNTANT) {
    return (
      connection?.isConnected() === true &&
      STATUSES_SEEN_BY_RECIPIENT.includes(exchange.status)
    );
  }
  return false;
}
