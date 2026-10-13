import { CabinetExchange } from '../entities/cabinet-exchange';
import { ExchangeEventKind } from '../entities/exchange-event';
import { CabinetExchangeSnapshot } from './cabinet-exchange-snapshot';

export function toCabinetExchangeSnapshot(
  exchange: CabinetExchange,
): CabinetExchangeSnapshot {
  return {
    id: exchange.id,
    direction: exchange.direction,
    status: exchange.status,
    category: exchange.category?.value ?? null,
    document: exchange.document,
    senderId: exchange.senderId,
    date: dateOf(exchange).toISOString(),
  };
}

function dateOf(exchange: CabinetExchange): Date {
  const transmission = exchange.history.find(
    (event) => event.kind === ExchangeEventKind.TRANSMITTED,
  );
  return transmission?.occurredAt ?? exchange.createdAt;
}
