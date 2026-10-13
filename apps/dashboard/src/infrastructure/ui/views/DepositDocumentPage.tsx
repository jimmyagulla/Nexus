import { CabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { useDepositCabinetExchange } from '../hooks/useDepositCabinetExchange';
import { i18n } from '../i18n/i18n';
import { readExchangeFile } from '../lib/read-exchange-file';
import { DepositDocument } from './DepositDocument';

interface DepositDocumentPageProps {
  deps: CabinetExchangeComposition;
}

export function DepositDocumentPage({ deps }: DepositDocumentPageProps) {
  const deposit = useDepositCabinetExchange(deps);

  return (
    <DepositDocument
      errorPresenter={deps.errorPresenter}
      depositError={
        deposit.isError ? deps.errorPresenter.present(deposit.error) : null
      }
      confirmation={
        deposit.isSuccess ? i18n.messages.cabinet.deposited : null
      }
      onDeposit={({ category, file }) =>
        readExchangeFile(file)
          .then((content) => deposit.mutateAsync({ category, file: content }))
          .then(
            () => true,
            () => false,
          )
      }
    />
  );
}
