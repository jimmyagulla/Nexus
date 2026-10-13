import type { CabinetExchangeViewModel } from '../../../adapters/presenters/cabinet-exchange.presenter';
import { ExchangeList } from '../features/cabinet-exchange/exchange-list/ExchangeList';
import { i18n } from '../i18n/i18n';

interface ReceivedDocumentsProps {
  exchanges: CabinetExchangeViewModel[];
  onOpen: (exchangeId: string) => void;
}

export function ReceivedDocuments({
  exchanges,
  onOpen,
}: ReceivedDocumentsProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">
        {i18n.messages.cabinet.receivedTitle}
      </h1>
      <ExchangeList exchanges={exchanges} onOpen={onOpen} />
    </div>
  );
}
