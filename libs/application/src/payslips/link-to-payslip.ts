import {
  documentFileFormatSpec,
  Payslip,
  PayslipFileLink,
} from '@hexagonal-monorepo-template/domain';
import { IPayslipFileStorage } from '@hexagonal-monorepo-template/ports';

/**
 * The short-lived link to the file of a payslip: one that opens it, or one
 * that saves it under its download name.
 */
export async function linkToPayslip(
  files: IPayslipFileStorage,
  payslip: Payslip,
  options: { download: boolean },
): Promise<PayslipFileLink> {
  return {
    payslipId: payslip.id,
    url: await files.linkTo(payslip.storageKey, {
      downloadAs: options.download ? payslip.downloadName : null,
    }),
    fileName: payslip.downloadName,
    contentType: documentFileFormatSpec(payslip.format).mimeType,
  };
}
