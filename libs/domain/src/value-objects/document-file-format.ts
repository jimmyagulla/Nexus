/** File formats a document may carry. */
export const DocumentFileFormat = {
  PDF: 'PDF',
  JPEG: 'JPEG',
  PNG: 'PNG',
  XLS: 'XLS',
  XLSX: 'XLSX',
  CSV: 'CSV',
} as const;

export type DocumentFileFormat =
  (typeof DocumentFileFormat)[keyof typeof DocumentFileFormat];

export type DocumentFileFormatSpec = {
  format: DocumentFileFormat;
  mimeType: string;
  extensions: readonly string[];
};

export const DOCUMENT_FILE_FORMATS: readonly DocumentFileFormatSpec[] = [
  { format: DocumentFileFormat.PDF, mimeType: 'application/pdf', extensions: ['pdf'] },
  { format: DocumentFileFormat.JPEG, mimeType: 'image/jpeg', extensions: ['jpg', 'jpeg'] },
  { format: DocumentFileFormat.PNG, mimeType: 'image/png', extensions: ['png'] },
  { format: DocumentFileFormat.XLS, mimeType: 'application/vnd.ms-excel', extensions: ['xls'] },
  {
    format: DocumentFileFormat.XLSX,
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extensions: ['xlsx'],
  },
  { format: DocumentFileFormat.CSV, mimeType: 'text/csv', extensions: ['csv'] },
];

/** Every accepted extension, without the dot. */
export const ACCEPTED_DOCUMENT_EXTENSIONS: readonly string[] =
  DOCUMENT_FILE_FORMATS.flatMap((spec) => spec.extensions);

/** Every accepted media type. */
export const ACCEPTED_DOCUMENT_MIME_TYPES: readonly string[] =
  DOCUMENT_FILE_FORMATS.map((spec) => spec.mimeType);

export function documentFileFormatSpec(
  format: DocumentFileFormat,
): DocumentFileFormatSpec {
  const spec = DOCUMENT_FILE_FORMATS.find((entry) => entry.format === format);
  if (spec === undefined) {
    throw new Error(`Unknown document file format: ${format}`);
  }
  return spec;
}

/** Extension of a file name, lower-cased and without the dot ('' when none). */
export function fileExtensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  return dot <= 0 || dot === fileName.length - 1
    ? ''
    : fileName.slice(dot + 1).toLowerCase();
}

/** Format announced by the extension of a file name, or null when not accepted. */
export function documentFileFormatOfName(
  fileName: string,
): DocumentFileFormat | null {
  const extension = fileExtensionOf(fileName);
  return (
    DOCUMENT_FILE_FORMATS.find((spec) => spec.extensions.includes(extension))
      ?.format ?? null
  );
}

const VALUES = new Set<string>(Object.values(DocumentFileFormat));

export function isDocumentFileFormat(
  value: string,
): value is DocumentFileFormat {
  return VALUES.has(value);
}
