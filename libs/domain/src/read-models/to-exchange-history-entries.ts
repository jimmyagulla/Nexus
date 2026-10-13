import { CabinetExchange } from '../entities/cabinet-exchange';
import { ExchangeEvent, ExchangeEventKind } from '../entities/exchange-event';
import { UserRole } from '../identity/user-role';
import { recipientRoleOf, senderRoleOf } from '../services/is-recipient';
import { ExchangeHistoryEntry } from './exchange-history-entry';

export function toExchangeHistoryEntries(
  exchange: CabinetExchange,
): ExchangeHistoryEntry[] {
  return exchange.history.map((event) => ({
    exchangeId: exchange.id,
    kind: event.kind,
    actorRole: actorRoleOf(exchange, event),
    occurredAt: event.occurredAt.toISOString(),
    documentCount: event.documentCount,
    direction: exchange.direction,
    fileName: exchange.document?.fileName ?? null,
  }));
}

function actorRoleOf(
  exchange: CabinetExchange,
  event: ExchangeEvent,
): UserRole | null {
  switch (event.kind) {
    case ExchangeEventKind.TRANSMITTED:
      return senderRoleOf(exchange);
    case ExchangeEventKind.RECEIVED:
      return null;
    default:
      return recipientRoleOf(exchange);
  }
}
