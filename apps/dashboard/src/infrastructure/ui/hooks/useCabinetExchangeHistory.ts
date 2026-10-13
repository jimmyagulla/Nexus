import { useQuery } from '@tanstack/react-query';
import { CabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';

export const cabinetExchangeHistoryQueryKey = (exchangeId?: string) => [
  'cabinet-exchange-history',
  exchangeId ?? 'all',
];

export function useCabinetExchangeHistory(
  { controller, historyPresenter }: CabinetExchangeComposition,
  exchangeId?: string,
) {
  return useQuery({
    queryKey: cabinetExchangeHistoryQueryKey(exchangeId),
    queryFn: async () =>
      historyPresenter.present(await controller.history(exchangeId)),
  });
}
