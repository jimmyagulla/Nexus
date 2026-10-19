import {
  CalendarDate,
  ExpenseAmount,
  ExpenseReport,
  ExpenseReportDescription,
  ExpenseReportProof,
  ExpenseReportProject,
  ExpenseReportProps,
  ExpenseVat,
  isExpenseVatRate,
} from '@hexagonal-monorepo-template/domain';
import type { ExpenseReport as ExpenseReportRecord } from '../../../infrastructure/prisma/prisma-client';

export function toExpenseReport(row: ExpenseReportRecord): ExpenseReport {
  return new ExpenseReport({
    id: row.id,
    companyId: row.companyId,
    ownerId: row.ownerId,
    date: CalendarDate.parse(row.date.toISOString().slice(0, 10)),
    category: row.category,
    paymentMethod: row.paymentMethod,
    amount: ExpenseAmount.parse(row.amount),
    vat: vatOf(row),
    description: ExpenseReportDescription.parse(row.description),
    project: ExpenseReportProject.parse(row.project),
    proof: proofOf(row),
    status: row.status,
    submittedAt: row.submittedAt,
    processedAt: row.processedAt,
  });
}

/** Columns of a report, from a report or a report about to be recorded. */
export function toExpenseReportColumns(
  report: Omit<ExpenseReportProps, 'id'>,
): Omit<ExpenseReportRecord, 'id'> {
  return {
    companyId: report.companyId,
    ownerId: report.ownerId,
    // A calendar day: midnight UTC, the database keeps the day only.
    date: new Date(`${report.date.value}T00:00:00.000Z`),
    category: report.category,
    paymentMethod: report.paymentMethod,
    amount: report.amount.value,
    vatRate: report.vat?.rate ?? null,
    vatAmount: report.vat?.amount.value ?? null,
    description: report.description.value,
    project: report.project?.value ?? null,
    proofFileName: report.proof?.fileName ?? null,
    proofFormat: report.proof?.format ?? null,
    proofSizeBytes: report.proof?.sizeBytes ?? null,
    proofStorageKey: report.proof?.storageKey ?? null,
    status: report.status,
    submittedAt: report.submittedAt,
    processedAt: report.processedAt,
  };
}

function vatOf(row: ExpenseReportRecord): ExpenseVat | null {
  if (row.vatRate === null || row.vatAmount === null || !isExpenseVatRate(row.vatRate)) {
    return null;
  }
  const amount = ExpenseAmount.read(row.vatAmount);
  return amount === null ? null : { rate: row.vatRate, amount };
}

function proofOf(row: ExpenseReportRecord): ExpenseReportProof | null {
  if (
    row.proofFileName === null ||
    row.proofFormat === null ||
    row.proofSizeBytes === null ||
    row.proofStorageKey === null
  ) {
    return null;
  }
  return {
    fileName: row.proofFileName,
    format: row.proofFormat,
    sizeBytes: row.proofSizeBytes,
    storageKey: row.proofStorageKey,
  };
}
