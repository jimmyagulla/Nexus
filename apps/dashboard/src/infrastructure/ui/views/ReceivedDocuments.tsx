import type { ExchangeFilters } from '@hexagonal-monorepo-template/domain';
import type { CabinetExchangeViewModel } from '../../../adapters/presenters/cabinet-exchange.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { ExchangeFiltersForm } from '../features/cabinet-exchange/exchange-filters/ExchangeFiltersForm';
import { ExchangeList } from '../features/cabinet-exchange/exchange-list/ExchangeList';
import { Button } from '../shared/button';
import { i18n } from '../i18n/i18n';

interface ReceivedDocumentsProps {
  exchanges: CabinetExchangeViewModel[];
  errorPresenter: ErrorPresenter;
  onOpen: (exchangeId: string) => void;
  onDeposit: () => void;
  onFilter: (filters: ExchangeFilters) => void;
  onReset: () => void;
}

export function ReceivedDocuments({
  exchanges,
  errorPresenter,
  onOpen,
  onDeposit,
  onFilter,
  onReset,
}: ReceivedDocumentsProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">
        {i18n.messages.cabinet.receivedTitle}
      </h1>
      <Button type="button" onClick={onDeposit}>
        {i18n.messages.cabinet.depositAction}
      </Button>
      <ExchangeFiltersForm
        errorPresenter={errorPresenter}
        withDirection={false}
        onFilter={onFilter}
        onReset={onReset}
      />
      <ExchangeList exchanges={exchanges} onOpen={onOpen} />
    </div>
  );
}
