import type { CabinetExchangeViewModel } from '../../../../../adapters/presenters/cabinet-exchange.presenter';
import { i18n } from '../../../i18n/i18n';
import { ExchangeCard } from './ExchangeCard';

interface ExchangeListProps {
  exchanges: CabinetExchangeViewModel[];
  onMarkToTransmit?: (exchangeId: string) => void;
  onTransmit?: (exchangeId: string) => void;
  onOpen?: (exchangeId: string) => void;
}

export function ExchangeList({
  exchanges,
  onMarkToTransmit,
  onTransmit,
  onOpen,
}: ExchangeListProps) {
  if (exchanges.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {i18n.messages.cabinet.noMatch}
      </p>
    );
  }

  return (
    <ul>
      {exchanges.map((exchange) => (
        <ExchangeCard
          key={exchange.id}
          exchange={exchange}
          onMarkToTransmit={onMarkToTransmit}
          onTransmit={onTransmit}
          onOpen={onOpen}
        />
      ))}
    </ul>
  );
}
