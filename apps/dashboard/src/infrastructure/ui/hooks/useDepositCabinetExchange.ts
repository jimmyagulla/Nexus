import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExchangeFileInput } from '@hexagonal-monorepo-template/domain';
import { CabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { listCabinetExchangesQueryKey } from './useListCabinetExchanges';

export function useDepositCabinetExchange({
  controller,
}: CabinetExchangeComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      category: string;
      file: ExchangeFileInput | null;
    }) => {
      await controller.deposit(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: listCabinetExchangesQueryKey(),
      });
    },
  });
}
