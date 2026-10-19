import { useMutation } from '@tanstack/react-query';
import type { PayslipsPageComposition } from '../../../composition/payslip/payslips-page.composition';
import { saveFile } from '../../lib/save-file';

/**
 * Saves a payslip on the device through the browser download manager, and
 * marks it as seen there. The file is read first, so that the download always
 * carries its own name.
 */
export function useDownloadPayslip({ controller, files, seenPayslips }: PayslipsPageComposition) {
  return useMutation({
    mutationFn: async (payslipId: string) => {
      const link = await controller.downloadPayslip(payslipId);
      saveFile(await files.read(link.url, link.contentType), link.fileName);
    },
    onSuccess: (_saved, payslipId) => seenPayslips.getState().markSeen([payslipId]),
  });
}
