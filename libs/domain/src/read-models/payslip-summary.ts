import { Payslip } from '../entities/payslip';
import { DocumentFileFormat } from '../value-objects/document-file-format';

/** Metadata of a payslip, as a list shows it. Never the file itself. */
export type PayslipSummary = {
  id: string;
  year: number;
  /** 1 = January. */
  month: number;
  employerName: string;
  /** Net pay, in euro cents. */
  netPayCents: number;
  fileName: string;
  format: DocumentFileFormat;
  sizeBytes: number;
  /** ISO 8601 instant. */
  availableAt: string;
};

export function toPayslipSummary(payslip: Payslip): PayslipSummary {
  return {
    id: payslip.id,
    year: payslip.period.year,
    month: payslip.period.month,
    employerName: payslip.employerName.value,
    netPayCents: payslip.netPayCents,
    fileName: payslip.fileName.value,
    format: payslip.format,
    sizeBytes: payslip.sizeBytes,
    availableAt: payslip.availableAt.toISOString(),
  };
}
