import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ExchangeFilters } from '@hexagonal-monorepo-template/domain';
import { CabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';

export const listCabinetExchangesQueryKey = (filters?: ExchangeFilters) =>
  filters === undefined
    ? ['cabinet-exchanges']
    : ['cabinet-exchanges', filters];

export function useListCabinetExchanges(
  { controller, presenter }: CabinetExchangeComposition,
  filters: ExchangeFilters = {},
) {
  return useQuery({
    queryKey: listCabinetExchangesQueryKey(filters),
    queryFn: async () => presenter.present(await controller.list(filters)),
    placeholderData: keepPreviousData,
  });
}
