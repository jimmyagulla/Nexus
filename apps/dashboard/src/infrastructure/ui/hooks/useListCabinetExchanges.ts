import { useQuery } from '@tanstack/react-query';
import { CabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';

export const listCabinetExchangesQueryKey = () => ['cabinet-exchanges'];

export function useListCabinetExchanges({
  controller,
  presenter,
}: CabinetExchangeComposition) {
  return useQuery({
    queryKey: listCabinetExchangesQueryKey(),
    queryFn: async () => presenter.present(await controller.list()),
  });
}
