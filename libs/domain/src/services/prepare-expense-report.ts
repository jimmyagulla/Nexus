import { ExpenseReportDetails, ExpenseVat } from '../entities/expense-report';
import { ErrorCode } from '../errors/error-code';
import { CalendarDate } from '../value-objects/calendar-date';
import { DocumentFileFormat } from '../value-objects/document-file-format';
import { ExpenseAmount } from '../value-objects/expense-amount';
import {
  ExpenseReportCategory,
  isExpenseReportCategory,
} from '../value-objects/expense-report-category';
import { ExpenseReportDescription } from '../value-objects/expense-report-description';
import {
  EXPENSE_REPORT_PROOF_MAX_SIZE_BYTES,
  EXPENSE_REPORT_PROOF_NAME_MAX_LENGTH,
} from '../value-objects/expense-report-limits';
import {
  ExpenseReportPaymentMethod,
  isExpenseReportPaymentMethod,
} from '../value-objects/expense-report-payment-method';
import { isExpenseReportProofFormat } from '../value-objects/expense-report-proof-format';
import { ExpenseReportProject } from '../value-objects/expense-report-project';
import { isExpenseVatRate } from '../value-objects/expense-vat-rate';
import { detectDocumentFileFormat } from './detect-document-file-format';

/** The fields of an expense report as typed, before any check. */
export type ExpenseReportRequest = {
  date: string;
  category: string;
  paymentMethod: string;
  /** Amount including VAT, "68,00" or "68.00". */
  amount: string;
  /** VAT rate in percent, or null without VAT. */
  vatRate: number | null;
  description: string;
  project: string | null;
};

/** A receipt as picked on the device. */
export type ExpenseReportProofUpload = {
  fileName: string;
  content: Uint8Array;
};

/** A receipt checked: its real format read from its content. */
export type PreparedExpenseReportProof = {
  fileName: string;
  format: DocumentFileFormat;
  sizeBytes: number;
  content: Uint8Array;
};

/** A new expense report, as its owner submits it. */
export type ExpenseReportSubmission = {
  details: ExpenseReportRequest;
  proof: ExpenseReportProofUpload | null;
};

/**
 * A change of an expense report. Without a new receipt, `keepProof` tells
 * whether the receipt already attached stays or goes.
 */
export type ExpenseReportRevision = {
  details: ExpenseReportRequest;
  proof: ExpenseReportProofUpload | null;
  keepProof: boolean;
};

export type ExpenseReportDraft = {
  details: ExpenseReportDetails;
  proof: PreparedExpenseReportProof | null;
};

export type ExpenseReportRevisionDraft = ExpenseReportDraft & {
  keepProof: boolean;
};

export function prepareExpenseReportSubmission(
  submission: ExpenseReportSubmission,
): ExpenseReportDraft {
  return {
    details: prepareExpenseReportDetails(submission.details),
    proof: submission.proof === null ? null : prepareExpenseReportProof(submission.proof),
  };
}

export function prepareExpenseReportRevision(
  revision: ExpenseReportRevision,
): ExpenseReportRevisionDraft {
  return {
    ...prepareExpenseReportSubmission(revision),
    keepProof: revision.keepProof,
  };
}

/** Checks every field; the VAT amount is computed from the rate, never typed. */
export function prepareExpenseReportDetails(
  request: ExpenseReportRequest,
): ExpenseReportDetails {
  const amount = ExpenseAmount.parse(request.amount);
  return {
    date: CalendarDate.parse(request.date),
    category: requireCategory(request.category),
    paymentMethod: requirePaymentMethod(request.paymentMethod),
    amount,
    vat: vatOf(amount, request.vatRate),
    description: ExpenseReportDescription.parse(request.description),
    project: ExpenseReportProject.parse(request.project),
  };
}

/**
 * Refuses an empty receipt, one above 10 MB, a name too long, and anything
 * but a PDF, a JPG or a PNG — read from the content, never from the name.
 */
export function prepareExpenseReportProof(
  upload: ExpenseReportProofUpload,
): PreparedExpenseReportProof {
  const fileName = upload.fileName.trim();
  if (fileName === '' || fileName.length > EXPENSE_REPORT_PROOF_NAME_MAX_LENGTH) {
    throw new Error(ErrorCode.INVALID_INFORMATION);
  }
  const sizeBytes = requireExpenseReportProofSize(upload.content.length);
  const format = detectDocumentFileFormat(fileName, upload.content);
  if (!isExpenseReportProofFormat(format)) {
    throw new Error(ErrorCode.UNSUPPORTED_FILE_FORMAT);
  }
  return { fileName, format, sizeBytes, content: upload.content };
}

/** Refuses an empty receipt, and one above the size a receipt may carry. */
export function requireExpenseReportProofSize(sizeBytes: number): number {
  if (sizeBytes <= 0) {
    throw new Error(ErrorCode.REQUIRED_INFORMATION);
  }
  if (sizeBytes > EXPENSE_REPORT_PROOF_MAX_SIZE_BYTES) {
    throw new Error(ErrorCode.FILE_TOO_LARGE);
  }
  return sizeBytes;
}

function vatOf(amount: ExpenseAmount, rate: number | null): ExpenseVat | null {
  if (rate === null) {
    return null;
  }
  if (!isExpenseVatRate(rate)) {
    throw new Error(ErrorCode.INVALID_INFORMATION);
  }
  return { rate, amount: amount.vatAt(rate) };
}

function requireCategory(raw: string): ExpenseReportCategory {
  if (raw.trim() === '') {
    throw new Error(ErrorCode.REQUIRED_INFORMATION);
  }
  if (!isExpenseReportCategory(raw)) {
    throw new Error(ErrorCode.INVALID_INFORMATION);
  }
  return raw;
}

function requirePaymentMethod(raw: string): ExpenseReportPaymentMethod {
  if (raw.trim() === '') {
    throw new Error(ErrorCode.REQUIRED_INFORMATION);
  }
  if (!isExpenseReportPaymentMethod(raw)) {
    throw new Error(ErrorCode.INVALID_INFORMATION);
  }
  return raw;
}
