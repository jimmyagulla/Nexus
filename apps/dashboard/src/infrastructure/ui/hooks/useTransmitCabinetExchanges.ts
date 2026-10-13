import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { listCabinetExchangesQueryKey } from './useListCabinetExchanges';

export function useTransmitCabinetExchanges({
  controller,
}: CabinetExchangeComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exchangeIds: readonly string[]) => {
      await controller.transmit(exchangeIds);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: listCabinetExchangesQueryKey(),
      });
    },
  });
}
