import {
  DOCUMENT_FILE_FORMATS,
  DocumentFileFormat,
  DocumentFileFormatSpec,
} from './document-file-format';

/** Formats a receipt may come in: a scan or a photo. */
export const EXPENSE_REPORT_PROOF_FORMATS: readonly DocumentFileFormat[] = [
  DocumentFileFormat.PDF,
  DocumentFileFormat.JPEG,
  DocumentFileFormat.PNG,
];

const SPECS: readonly DocumentFileFormatSpec[] = DOCUMENT_FILE_FORMATS.filter((spec) =>
  EXPENSE_REPORT_PROOF_FORMATS.includes(spec.format),
);

/** Every accepted receipt extension, without the dot. */
export const ACCEPTED_EXPENSE_REPORT_PROOF_EXTENSIONS: readonly string[] =
  SPECS.flatMap((spec) => spec.extensions);

/** Every accepted receipt media type. */
export const ACCEPTED_EXPENSE_REPORT_PROOF_MIME_TYPES: readonly string[] =
  SPECS.map((spec) => spec.mimeType);

export function isExpenseReportProofFormat(format: DocumentFileFormat): boolean {
  return EXPENSE_REPORT_PROOF_FORMATS.includes(format);
}
