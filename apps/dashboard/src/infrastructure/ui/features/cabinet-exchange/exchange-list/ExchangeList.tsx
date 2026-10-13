import type { CabinetExchangeViewModel } from '../../../../../adapters/presenters/cabinet-exchange.presenter';
import { ExchangeCard } from './ExchangeCard';

interface ExchangeListProps {
  exchanges: CabinetExchangeViewModel[];
  onMarkToTransmit: (exchangeId: string) => void;
  onTransmit: (exchangeId: string) => void;
}

export function ExchangeList({
  exchanges,
  onMarkToTransmit,
  onTransmit,
}: ExchangeListProps) {
  return (
    <ul>
      {exchanges.map((exchange) => (
        <ExchangeCard
          key={exchange.id}
          exchange={exchange}
          onMarkToTransmit={onMarkToTransmit}
          onTransmit={onTransmit}
        />
      ))}
    </ul>
  );
}
