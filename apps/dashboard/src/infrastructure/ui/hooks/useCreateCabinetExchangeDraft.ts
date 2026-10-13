import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExchangeFileInput } from '@hexagonal-monorepo-template/domain';
import { CabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { listCabinetExchangesQueryKey } from './useListCabinetExchanges';

export function useCreateCabinetExchangeDraft({
  controller,
}: CabinetExchangeComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      category?: string | null;
      file?: ExchangeFileInput | null;
    }) => {
      await controller.createDraft(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: listCabinetExchangesQueryKey(),
      });
    },
  });
}
