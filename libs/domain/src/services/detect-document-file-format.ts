import { ErrorCode } from '../errors/error-code';
import {
  DocumentFileFormat,
  documentFileFormatOfName,
} from '../value-objects/document-file-format';

const PDF_SIGNATURE = [0x25, 0x50, 0x44, 0x46, 0x2d]; // %PDF-
/** The PDF specification tolerates bytes before the header. */
const PDF_HEADER_WINDOW = 1024;
const JPEG_SIGNATURE = [0xff, 0xd8, 0xff];
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const OLE2_SIGNATURE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
const ZIP_SIGNATURE = [0x50, 0x4b, 0x03, 0x04];
/** Entry every spreadsheet package names. */
const XLSX_WORKBOOK_ENTRY = asciiBytes('xl/workbook');
/** Stream name of an Excel 97-2003 workbook, as stored (UTF-16LE). */
const XLS_WORKBOOK_STREAM = utf16leBytes('Workbook');
const XLS_LEGACY_BOOK_STREAM = utf16leBytes('Book');

/**
 * Reads the real format of a file from its content and checks that its
 * extension announces that same format. Throws UNSUPPORTED_FILE_FORMAT
 * otherwise: an extension alone is never trusted.
 */
export function detectDocumentFileFormat(
  fileName: string,
  content: Uint8Array,
): DocumentFileFormat {
  const announced = documentFileFormatOfName(fileName);
  if (announced === null || content.length === 0) {
    throw new Error(ErrorCode.UNSUPPORTED_FILE_FORMAT);
  }

  const actual = formatOfContent(content);
  const matches =
    actual === announced ||
    (actual === null && announced === DocumentFileFormat.CSV && isPlainText(content));
  if (!matches) {
    throw new Error(ErrorCode.UNSUPPORTED_FILE_FORMAT);
  }
  return announced;
}

function formatOfContent(content: Uint8Array): DocumentFileFormat | null {
  if (indexOf(content, PDF_SIGNATURE, 0, PDF_HEADER_WINDOW) !== -1) {
    return DocumentFileFormat.PDF;
  }
  if (startsWith(content, JPEG_SIGNATURE)) {
    return DocumentFileFormat.JPEG;
  }
  if (startsWith(content, PNG_SIGNATURE)) {
    return DocumentFileFormat.PNG;
  }
  if (
    startsWith(content, OLE2_SIGNATURE) &&
    (indexOf(content, XLS_WORKBOOK_STREAM) !== -1 ||
      indexOf(content, XLS_LEGACY_BOOK_STREAM) !== -1)
  ) {
    return DocumentFileFormat.XLS;
  }
  if (
    startsWith(content, ZIP_SIGNATURE) &&
    indexOf(content, XLSX_WORKBOOK_ENTRY) !== -1
  ) {
    return DocumentFileFormat.XLSX;
  }
  return null;
}

/** Text without control characters other than tab, line feed and carriage return. */
function isPlainText(content: Uint8Array): boolean {
  return content.every(
    (byte) => byte === 0x09 || byte === 0x0a || byte === 0x0d || (byte >= 0x20 && byte !== 0x7f),
  );
}

function startsWith(content: Uint8Array, signature: readonly number[]): boolean {
  return indexOf(content, signature, 0, 1) === 0;
}

/** First index of `pattern` starting strictly before `searchEnd`, or -1. */
function indexOf(
  content: Uint8Array,
  pattern: readonly number[],
  from = 0,
  searchEnd = content.length,
): number {
  const lastStart = Math.min(searchEnd, content.length - pattern.length + 1);
  for (let start = from; start < lastStart; start += 1) {
    let index = 0;
    while (index < pattern.length && content[start + index] === pattern[index]) {
      index += 1;
    }
    if (index === pattern.length) {
      return start;
    }
  }
  return -1;
}

function asciiBytes(text: string): number[] {
  return [...text].map((character) => character.charCodeAt(0));
}

function utf16leBytes(text: string): number[] {
  return asciiBytes(text).flatMap((code) => [code, 0x00]);
}
