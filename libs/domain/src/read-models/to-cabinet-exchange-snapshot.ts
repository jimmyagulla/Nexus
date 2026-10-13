import { CabinetExchange } from '../entities/cabinet-exchange';
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
    date: exchange.date().toISOString(),
    consultedAt: exchange.firstConsultedAt()?.toISOString() ?? null,
  };
}
