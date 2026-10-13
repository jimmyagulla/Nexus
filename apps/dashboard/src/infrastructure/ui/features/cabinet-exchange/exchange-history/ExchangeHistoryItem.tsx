import type { ExchangeHistoryEntryViewModel } from '../../../../../adapters/presenters/cabinet-exchange-history.presenter';

interface ExchangeHistoryItemProps {
  entry: ExchangeHistoryEntryViewModel;
}

export function ExchangeHistoryItem({ entry }: ExchangeHistoryItemProps) {
  return (
    <li className="flex flex-wrap items-center gap-4 py-2">
      <span>{entry.when}</span>
      <span>{entry.who}</span>
      <span>{entry.phrase}</span>
    </li>
  );
}
