import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { NewExchangeDialog } from '../features/cabinet-exchange/new-exchange/NewExchangeDialog';
import type { NewExchangeValues } from '../features/cabinet-exchange/new-exchange/new-exchange.schema';
import { i18n } from '../i18n/i18n';

interface CabinetExchangesEmptyProps {
  errorPresenter: ErrorPresenter;
  createError: string | null;
  onCreate: (values: NewExchangeValues) => Promise<boolean>;
}

export function CabinetExchangesEmpty({
  errorPresenter,
  createError,
  onCreate,
}: CabinetExchangesEmptyProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">{i18n.messages.cabinet.title}</h1>
      <p className="text-sm text-muted-foreground">
        {i18n.messages.cabinet.emptyList}
      </p>
      <NewExchangeDialog
        errorPresenter={errorPresenter}
        submissionError={createError}
        onSubmit={onCreate}
      />
    </div>
  );
}
