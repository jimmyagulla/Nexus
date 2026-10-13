import { CabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { useCabinetExchangeHistory } from '../hooks/useCabinetExchangeHistory';
import { useDownloadCabinetExchangeFile } from '../hooks/useDownloadCabinetExchangeFile';
import { useOpenCabinetExchange } from '../hooks/useOpenCabinetExchange';
import { i18n } from '../i18n/i18n';
import { ExchangeDetail } from './ExchangeDetail';

interface ExchangeDetailPageProps {
  deps: CabinetExchangeComposition;
  exchangeId: string;
  onBack: () => void;
}

export function ExchangeDetailPage({
  deps,
  exchangeId,
  onBack,
}: ExchangeDetailPageProps) {
  const exchange = useOpenCabinetExchange(deps, exchangeId);
  const history = useCabinetExchangeHistory(deps, exchangeId);
  const download = useDownloadCabinetExchangeFile(deps);

  if (exchange.isPending) {
    return <p>{i18n.messages.loading}</p>;
  }

  if (exchange.isError) {
    return <p>{deps.errorPresenter.present(exchange.error)}</p>;
  }

  return (
    <ExchangeDetail
      exchange={exchange.data}
      history={history.data ?? []}
      downloadError={
        download.isError ? deps.errorPresenter.present(download.error) : null
      }
      onDownload={() => download.mutate(exchangeId)}
      onBack={onBack}
    />
  );
}
