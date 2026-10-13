import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { Confirmation } from '../common/feedback/Confirmation';
import { NewExchangeForm } from '../features/cabinet-exchange/new-exchange/NewExchangeForm';
import type { NewExchangeValues } from '../features/cabinet-exchange/new-exchange/new-exchange.schema';
import { i18n } from '../i18n/i18n';

interface DepositDocumentProps {
  errorPresenter: ErrorPresenter;
  depositError: string | null;
  confirmation: string | null;
  onDeposit: (values: NewExchangeValues) => Promise<boolean>;
}

export function DepositDocument({
  errorPresenter,
  depositError,
  confirmation,
  onDeposit,
}: DepositDocumentProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">
        {i18n.messages.cabinet.depositTitle}
      </h1>
      <NewExchangeForm
        errorPresenter={errorPresenter}
        submissionError={depositError}
        submitLabel={i18n.messages.cabinet.deposit}
        onSubmit={onDeposit}
      />
      <Confirmation message={confirmation} />
    </div>
  );
}
