import { useMutation } from '@tanstack/react-query';
import { CabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { saveFile } from '../lib/save-file';

export function useDownloadCabinetExchangeFile({
  controller,
}: CabinetExchangeComposition) {
  return useMutation({
    mutationFn: async (exchangeId: string) => {
      saveFile(await controller.download(exchangeId));
    },
  });
}
