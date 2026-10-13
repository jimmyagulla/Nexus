import { CabinetConnection } from '../entities/cabinet-connection';
import { CabinetExchange } from '../entities/cabinet-exchange';
import { ExchangeDirection } from '../entities/exchange-direction';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { isVisibleTo } from './exchange-visibility';

/** The history of the cabinet also tells what it deposited itself. */
export function isInHistoryOf(
  exchange: CabinetExchange,
  actor: ActorContext,
  connection: CabinetConnection | null,
): boolean {
  if (isVisibleTo(exchange, actor, connection)) {
    return true;
  }
  return (
    actor.role === UserRole.ACCOUNTANT &&
    actor.companyId === exchange.companyId &&
    connection?.isConnected() === true &&
    exchange.direction === ExchangeDirection.CABINET_TO_COMPANY
  );
}
