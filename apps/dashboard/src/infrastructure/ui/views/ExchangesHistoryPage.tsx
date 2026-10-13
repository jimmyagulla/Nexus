import { CabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { useCabinetExchangeHistory } from '../hooks/useCabinetExchangeHistory';
import { i18n } from '../i18n/i18n';
import { ExchangesHistory } from './ExchangesHistory';

interface ExchangesHistoryPageProps {
  deps: CabinetExchangeComposition;
}

export function ExchangesHistoryPage({ deps }: ExchangesHistoryPageProps) {
  const history = useCabinetExchangeHistory(deps);

  if (history.isPending) {
    return <p>{i18n.messages.loading}</p>;
  }

  if (history.isError) {
    return <p>{deps.errorPresenter.present(history.error)}</p>;
  }

  return <ExchangesHistory entries={history.data} />;
}
