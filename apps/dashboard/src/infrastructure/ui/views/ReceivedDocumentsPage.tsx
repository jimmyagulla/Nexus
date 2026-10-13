import { CabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { useListCabinetExchanges } from '../hooks/useListCabinetExchanges';
import { i18n } from '../i18n/i18n';
import { ReceivedDocuments } from './ReceivedDocuments';

interface ReceivedDocumentsPageProps {
  deps: CabinetExchangeComposition;
  onOpen: (exchangeId: string) => void;
}

export function ReceivedDocumentsPage({
  deps,
  onOpen,
}: ReceivedDocumentsPageProps) {
  const exchanges = useListCabinetExchanges(deps);

  if (exchanges.isPending) {
    return <p>{i18n.messages.loading}</p>;
  }

  if (exchanges.isError) {
    return <p>{deps.errorPresenter.present(exchanges.error)}</p>;
  }

  return <ReceivedDocuments exchanges={exchanges.data} onOpen={onOpen} />;
}
