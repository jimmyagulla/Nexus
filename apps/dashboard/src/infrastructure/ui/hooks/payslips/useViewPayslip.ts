import { useMutation } from '@tanstack/react-query';
import type { PayslipsPageComposition } from '../../../composition/payslip/payslips-page.composition';
import { previewOf, type FilePreview } from '../../lib/file-preview';

/** Reads a payslip for the in-app viewer; opening it marks it as seen on this device. */
export function useViewPayslip({ controller, files, seenPayslips }: PayslipsPageComposition) {
  return useMutation({
    mutationFn: async (payslipId: string): Promise<FilePreview> => {
      const link = await controller.viewPayslip(payslipId);
      return previewOf(await files.read(link.url, link.contentType), link);
    },
    onSuccess: (_preview, payslipId) => seenPayslips.getState().markSeen([payslipId]),
  });
}
