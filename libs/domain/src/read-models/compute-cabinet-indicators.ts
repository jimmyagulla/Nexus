import { CabinetExchange } from '../entities/cabinet-exchange';
import { ExchangeDirection } from '../entities/exchange-direction';
import { ExchangeStatus } from '../entities/exchange-status';
import { CabinetIndicators } from './cabinet-indicators';

export function computeCabinetIndicators(
  exchanges: readonly CabinetExchange[],
): CabinetIndicators {
  const incoming = exchanges.filter(
    (exchange) => exchange.direction === ExchangeDirection.CABINET_TO_COMPANY,
  );
  return {
    toTransmit: count(exchanges, ExchangeStatus.TO_TRANSMIT),
    received:
      count(incoming, ExchangeStatus.RECEIVED) +
      count(incoming, ExchangeStatus.CONSULTED),
    notConsulted: count(incoming, ExchangeStatus.RECEIVED),
  };
}

function count(
  exchanges: readonly CabinetExchange[],
  status: ExchangeStatus,
): number {
  return exchanges.filter((exchange) => exchange.status === status).length;
}
