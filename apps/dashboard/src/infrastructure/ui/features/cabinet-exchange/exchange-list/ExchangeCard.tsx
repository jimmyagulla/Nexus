import type { CabinetExchangeViewModel } from '../../../../../adapters/presenters/cabinet-exchange.presenter';
import { Button } from '../../../shared/button';
import { i18n } from '../../../i18n/i18n';

interface ExchangeCardProps {
  exchange: CabinetExchangeViewModel;
  onMarkToTransmit?: (exchangeId: string) => void;
  onTransmit?: (exchangeId: string) => void;
  onOpen?: (exchangeId: string) => void;
}

export function ExchangeCard({
  exchange,
  onMarkToTransmit,
  onTransmit,
  onOpen,
}: ExchangeCardProps) {
  return (
    <li className="flex flex-wrap items-center gap-4 py-2">
      <span>{exchange.category}</span>
      <span>{exchange.fileName}</span>
      <span>{exchange.direction}</span>
      <span>{exchange.status}</span>
      <span>{exchange.date}</span>
      {exchange.canMarkToTransmit && onMarkToTransmit ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => onMarkToTransmit(exchange.id)}
        >
          {i18n.messages.cabinet.markToTransmit}
        </Button>
      ) : null}
      {exchange.canTransmit && onTransmit ? (
        <Button type="button" onClick={() => onTransmit(exchange.id)}>
          {i18n.messages.cabinet.transmit}
        </Button>
      ) : null}
      {exchange.canOpen && onOpen ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpen(exchange.id)}
        >
          {i18n.messages.cabinet.open}
        </Button>
      ) : null}
    </li>
  );
}
