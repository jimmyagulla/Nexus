import type { CabinetExchangeViewModel } from '../../../adapters/presenters/cabinet-exchange.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { Confirmation } from '../common/feedback/Confirmation';
import { SubmissionError } from '../common/errors/SubmissionError';
import { ExchangeList } from '../features/cabinet-exchange/exchange-list/ExchangeList';
import { NewExchangeDialog } from '../features/cabinet-exchange/new-exchange/NewExchangeDialog';
import type { NewExchangeValues } from '../features/cabinet-exchange/new-exchange/new-exchange.schema';
import { i18n } from '../i18n/i18n';

interface CabinetExchangesProps {
  exchanges: CabinetExchangeViewModel[];
  errorPresenter: ErrorPresenter;
  createError: string | null;
  actionError: string | null;
  confirmation: string | null;
  onCreate: (values: NewExchangeValues) => Promise<boolean>;
  onMarkToTransmit: (exchangeId: string) => void;
  onTransmit: (exchangeId: string) => void;
  onOpen: (exchangeId: string) => void;
}

export function CabinetExchanges({
  exchanges,
  errorPresenter,
  createError,
  actionError,
  confirmation,
  onCreate,
  onMarkToTransmit,
  onTransmit,
  onOpen,
}: CabinetExchangesProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">{i18n.messages.cabinet.title}</h1>

      <NewExchangeDialog
        errorPresenter={errorPresenter}
        submissionError={createError}
        onSubmit={onCreate}
      />
      <SubmissionError message={actionError} />
      <Confirmation message={confirmation} />
      <ExchangeList
        exchanges={exchanges}
        onMarkToTransmit={onMarkToTransmit}
        onTransmit={onTransmit}
        onOpen={onOpen}
      />
    </div>
  );
}
