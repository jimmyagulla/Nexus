import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { CabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { useCreateCabinetExchangeDraft } from '../hooks/useCreateCabinetExchangeDraft';
import { useListCabinetExchanges } from '../hooks/useListCabinetExchanges';
import { useMarkCabinetExchangeToTransmit } from '../hooks/useMarkCabinetExchangeToTransmit';
import { useTransmitCabinetExchanges } from '../hooks/useTransmitCabinetExchanges';
import { i18n } from '../i18n/i18n';
import { readExchangeFile } from '../lib/read-exchange-file';
import { CabinetExchanges } from './CabinetExchanges';

interface CabinetExchangesPageProps {
  deps: CabinetExchangeComposition;
}

export function CabinetExchangesPage({ deps }: CabinetExchangesPageProps) {
  const exchanges = useListCabinetExchanges(deps);
  const create = useCreateCabinetExchangeDraft(deps);
  const mark = useMarkCabinetExchangeToTransmit(deps);
  const transmit = useTransmitCabinetExchanges(deps);

  if (exchanges.isPending) {
    return <p>{i18n.messages.loading}</p>;
  }

  if (exchanges.isError) {
    return <p>{deps.errorPresenter.present(exchanges.error)}</p>;
  }

  return (
    <CabinetExchanges
      exchanges={exchanges.data}
      errorPresenter={deps.errorPresenter}
      createError={refusalOf(deps.errorPresenter, create)}
      actionError={
        refusalOf(deps.errorPresenter, mark) ??
        refusalOf(deps.errorPresenter, transmit)
      }
      confirmation={
        transmit.isSuccess ? i18n.messages.cabinet.transmitted : null
      }
      onCreate={async ({ category, file }) =>
        accepted(
          readExchangeFile(file).then((content) =>
            create.mutateAsync({ category, file: content }),
          ),
        )
      }
      onMarkToTransmit={(exchangeId) => mark.mutate(exchangeId)}
      onTransmit={(exchangeId) => transmit.mutate([exchangeId])}
    />
  );
}

function refusalOf(
  presenter: ErrorPresenter,
  mutation: { isError: boolean; error: unknown },
): string | null {
  return mutation.isError ? presenter.present(mutation.error) : null;
}

function accepted(mutation: Promise<unknown>): Promise<boolean> {
  return mutation.then(
    () => true,
    () => false,
  );
}
