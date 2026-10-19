import { ExpenseReport } from '../entities/expense-report';
import { DocumentFileFormat } from '../value-objects/document-file-format';
import { ExpenseReportCategory } from '../value-objects/expense-report-category';
import { ExpenseReportPaymentMethod } from '../value-objects/expense-report-payment-method';
import { ExpenseReportStatus } from '../value-objects/expense-report-status';
import { ExpenseVatRate } from '../value-objects/expense-vat-rate';

/** Metadata of a receipt, as a list shows it. Never the file itself. */
export type ExpenseReportProofSummary = {
  fileName: string;
  format: DocumentFileFormat;
  sizeBytes: number;
};

/** An expense report, as a list and its detail show it. */
export type ExpenseReportSummary = {
  id: string;
  /** Calendar day (YYYY-MM-DD). */
  date: string;
  category: ExpenseReportCategory;
  paymentMethod: ExpenseReportPaymentMethod;
  /** Amount including VAT, "68.00". */
  amount: string;
  vatRate: ExpenseVatRate | null;
  /** "6.18", or null without VAT. */
  vatAmount: string | null;
  description: string;
  project: string | null;
  proof: ExpenseReportProofSummary | null;
  status: ExpenseReportStatus;
  /** Its owner may still change it. */
  editable: boolean;
  /** ISO 8601 instant. */
  submittedAt: string;
  /** ISO 8601 instant, or null until refunded or refused. */
  processedAt: string | null;
};

export function toExpenseReportSummary(report: ExpenseReport): ExpenseReportSummary {
  return {
    id: report.id,
    date: report.date.value,
    category: report.category,
    paymentMethod: report.paymentMethod,
    amount: report.amount.value,
    vatRate: report.vat?.rate ?? null,
    vatAmount: report.vat?.amount.value ?? null,
    description: report.description.value,
    project: report.project?.value ?? null,
    proof:
      report.proof === null
        ? null
        : {
            fileName: report.proof.fileName,
            format: report.proof.format,
            sizeBytes: report.proof.sizeBytes,
          },
    status: report.status,
    editable: report.editable,
    submittedAt: report.submittedAt.toISOString(),
    processedAt: report.processedAt?.toISOString() ?? null,
  };
}
