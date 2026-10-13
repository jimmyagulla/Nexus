import { useState } from 'react';
import {
  ExchangeFilters,
  hasExchangeFilters,
} from '@hexagonal-monorepo-template/domain';
import { CabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { useListCabinetExchanges } from '../hooks/useListCabinetExchanges';
import { i18n } from '../i18n/i18n';
import { ReceivedDocuments } from './ReceivedDocuments';
import { ReceivedDocumentsEmpty } from './ReceivedDocumentsEmpty';

interface ReceivedDocumentsPageProps {
  deps: CabinetExchangeComposition;
  onOpen: (exchangeId: string) => void;
  onDeposit: () => void;
}

export function ReceivedDocumentsPage({
  deps,
  onOpen,
  onDeposit,
}: ReceivedDocumentsPageProps) {
  const [filters, setFilters] = useState<ExchangeFilters>({});
  const exchanges = useListCabinetExchanges(deps, filters);

  if (exchanges.isPending) {
    return <p>{i18n.messages.loading}</p>;
  }

  if (exchanges.isError) {
    return <p>{deps.errorPresenter.present(exchanges.error)}</p>;
  }

  if (exchanges.data.length === 0 && !hasExchangeFilters(filters)) {
    return <ReceivedDocumentsEmpty onDeposit={onDeposit} />;
  }

  return (
    <ReceivedDocuments
      exchanges={exchanges.data}
      errorPresenter={deps.errorPresenter}
      onOpen={onOpen}
      onDeposit={onDeposit}
      onFilter={setFilters}
      onReset={() => setFilters({})}
    />
  );
}
