import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { listCabinetExchangesQueryKey } from './useListCabinetExchanges';

export function useMarkCabinetExchangeToTransmit({
  controller,
}: CabinetExchangeComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exchangeId: string) => {
      await controller.markToTransmit(exchangeId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: listCabinetExchangesQueryKey(),
      });
    },
  });
}
