import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { listCabinetExchangesQueryKey } from './useListCabinetExchanges';

export const openCabinetExchangeQueryKey = (exchangeId: string) => [
  'cabinet-exchange',
  exchangeId,
];

export function useOpenCabinetExchange(
  { controller, presenter }: CabinetExchangeComposition,
  exchangeId: string,
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: openCabinetExchangeQueryKey(exchangeId),
    queryFn: async () => {
      const [opened] = presenter.present([await controller.open(exchangeId)]);
      void queryClient.invalidateQueries({
        queryKey: listCabinetExchangesQueryKey(),
      });
      return opened;
    },
  });
}
