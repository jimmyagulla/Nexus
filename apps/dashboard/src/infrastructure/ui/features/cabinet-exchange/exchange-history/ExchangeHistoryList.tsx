import type { ExchangeHistoryEntryViewModel } from '../../../../../adapters/presenters/cabinet-exchange-history.presenter';
import { i18n } from '../../../i18n/i18n';
import { ExchangeHistoryItem } from './ExchangeHistoryItem';

interface ExchangeHistoryListProps {
  entries: ExchangeHistoryEntryViewModel[];
}

export function ExchangeHistoryList({ entries }: ExchangeHistoryListProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {i18n.messages.cabinet.historyEmpty}
      </p>
    );
  }

  return (
    <ul>
      {entries.map((entry) => (
        <ExchangeHistoryItem key={entry.key} entry={entry} />
      ))}
    </ul>
  );
}
