import { CabinetConnection } from '../entities/cabinet-connection';
import { CabinetExchange } from '../entities/cabinet-exchange';
import { ExchangeDirection } from '../entities/exchange-direction';
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
    return isVisibleToEmployer(exchange, actor);
  }
  if (actor.role === UserRole.ACCOUNTANT) {
    return isVisibleToCabinet(exchange, connection);
  }
  return false;
}

function isVisibleToEmployer(
  exchange: CabinetExchange,
  actor: ActorContext,
): boolean {
  if (exchange.direction === ExchangeDirection.CABINET_TO_COMPANY) {
    return STATUSES_SEEN_BY_RECIPIENT.includes(exchange.status);
  }
  return (
    exchange.status !== ExchangeStatus.DRAFT ||
    exchange.senderId === actor.userId
  );
}

function isVisibleToCabinet(
  exchange: CabinetExchange,
  connection: CabinetConnection | null,
): boolean {
  return (
    exchange.direction === ExchangeDirection.COMPANY_TO_CABINET &&
    connection?.isConnected() === true &&
    STATUSES_SEEN_BY_RECIPIENT.includes(exchange.status)
  );
}
