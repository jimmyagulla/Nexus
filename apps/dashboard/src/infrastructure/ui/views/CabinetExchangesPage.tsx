import { useState } from 'react';
import {
  ExchangeFilters,
  hasExchangeFilters,
} from '@hexagonal-monorepo-template/domain';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { CabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { useCreateCabinetExchangeDraft } from '../hooks/useCreateCabinetExchangeDraft';
import { useListCabinetExchanges } from '../hooks/useListCabinetExchanges';
import { useMarkCabinetExchangeToTransmit } from '../hooks/useMarkCabinetExchangeToTransmit';
import { useTransmitCabinetExchanges } from '../hooks/useTransmitCabinetExchanges';
import { i18n } from '../i18n/i18n';
import { readExchangeFile } from '../lib/read-exchange-file';
import { CabinetExchanges } from './CabinetExchanges';
import { CabinetExchangesEmpty } from './CabinetExchangesEmpty';

interface CabinetExchangesPageProps {
  deps: CabinetExchangeComposition;
  onOpen: (exchangeId: string) => void;
}

export function CabinetExchangesPage({
  deps,
  onOpen,
}: CabinetExchangesPageProps) {
  const [filters, setFilters] = useState<ExchangeFilters>({});
  const exchanges = useListCabinetExchanges(deps, filters);
  const create = useCreateCabinetExchangeDraft(deps);
  const mark = useMarkCabinetExchangeToTransmit(deps);
  const transmit = useTransmitCabinetExchanges(deps);

  if (exchanges.isPending) {
    return <p>{i18n.messages.loading}</p>;
  }

  if (exchanges.isError) {
    return <p>{deps.errorPresenter.present(exchanges.error)}</p>;
  }

  const createAccepted = ({ category, file }: { category: string; file: File }) =>
    accepted(
      readExchangeFile(file).then((content) =>
        create.mutateAsync({ category, file: content }),
      ),
    );

  if (exchanges.data.length === 0 && !hasExchangeFilters(filters)) {
    return (
      <CabinetExchangesEmpty
        errorPresenter={deps.errorPresenter}
        createError={refusalOf(deps.errorPresenter, create)}
        onCreate={createAccepted}
      />
    );
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
      onCreate={createAccepted}
      onMarkToTransmit={(exchangeId) => mark.mutate(exchangeId)}
      onTransmit={(exchangeId) => transmit.mutate([exchangeId])}
      onOpen={onOpen}
      onFilter={setFilters}
      onReset={() => setFilters({})}
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
