import type { ExchangeHistoryEntryViewModel } from '../../../adapters/presenters/cabinet-exchange-history.presenter';
import { ExchangeHistoryList } from '../features/cabinet-exchange/exchange-history/ExchangeHistoryList';
import { i18n } from '../i18n/i18n';

interface ExchangesHistoryProps {
  entries: ExchangeHistoryEntryViewModel[];
}

export function ExchangesHistory({ entries }: ExchangesHistoryProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">
        {i18n.messages.cabinet.historyTitle}
      </h1>
      <ExchangeHistoryList entries={entries} />
    </div>
  );
}
