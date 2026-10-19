import { useMutation } from '@tanstack/react-query';
import { distinctFileNames } from '@hexagonal-monorepo-template/domain';
import type { PayslipYearCriteria } from '../../../../adapters/controllers/payslips.controller';
import type { PayslipsPageComposition } from '../../../composition/payslip/payslips-page.composition';
import { saveFile } from '../../lib/save-file';

/**
 * Saves every payslip of the list in one ZIP archive, and marks them all as
 * seen on this device. Returns the payslips it saved.
 */
export function useExportPayslips({
  controller,
  files,
  archiver,
  archiveName,
  seenPayslips,
}: PayslipsPageComposition) {
  return useMutation({
    mutationFn: async (criteria: PayslipYearCriteria): Promise<string[]> => {
      const links = await controller.exportPayslips(criteria);
      const contents = await Promise.all(
        links.map(async (link) => new Uint8Array(await (await files.read(link.url, link.contentType)).arrayBuffer())),
      );
      const names = distinctFileNames(links.map((link) => link.fileName));
      const archive = await archiver.archive(
        contents.map((content, index) => ({ name: names[index], content })),
      );
      saveFile(
        new Blob([archive as Uint8Array<ArrayBuffer>], { type: archiver.contentType }),
        archiveName.present(criteria.year),
      );
      return links.map((link) => link.payslipId);
    },
    onSuccess: (payslipIds) => seenPayslips.getState().markSeen(payslipIds),
  });
}
