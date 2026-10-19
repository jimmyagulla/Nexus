import { ErrorCode } from '../errors/error-code';
import { DocumentFileFormat } from '../value-objects/document-file-format';
import { detectDocumentFileFormat } from './detect-document-file-format';

function bytes(...parts: (number[] | string)[]): Uint8Array {
  return Uint8Array.from(
    parts.flatMap((part) =>
      typeof part === 'string' ? [...part].map((c) => c.charCodeAt(0)) : part,
    ),
  );
}

function utf16le(text: string): number[] {
  return [...text].flatMap((c) => [c.charCodeAt(0), 0]);
}

const pdf = bytes('%PDF-1.7\n', [0x0a, 0x25, 0xe2, 0xe3]);
const jpeg = bytes([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10], 'JFIF');
const png = bytes([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
const xlsx = bytes([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00], '[Content_Types].xml', [0x50, 0x4b, 0x03, 0x04], 'xl/workbook.xml');
const docx = bytes([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00], '[Content_Types].xml', [0x50, 0x4b, 0x03, 0x04], 'word/document.xml');
const xls = bytes([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0x00], utf16le('Workbook'));
const doc = bytes([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0x00], utf16le('WordDocument'));
const csv = bytes('nom;montant\r\nTaxi;12,50\r\n');

describe('detectDocumentFileFormat', () => {
  it.each([
    ['arret.pdf', pdf, DocumentFileFormat.PDF],
    ['photo.jpg', jpeg, DocumentFileFormat.JPEG],
    ['photo.JPEG', jpeg, DocumentFileFormat.JPEG],
    ['scan.png', png, DocumentFileFormat.PNG],
    ['frais.xlsx', xlsx, DocumentFileFormat.XLSX],
    ['frais.xls', xls, DocumentFileFormat.XLS],
    ['frais.csv', csv, DocumentFileFormat.CSV],
  ])('recognises %s from its content', (fileName, content, format) => {
    expect(detectDocumentFileFormat(fileName, content)).toBe(format);
  });

  it('accepts a PDF whose header follows a few stray bytes', () => {
    expect(
      detectDocumentFileFormat('scan.pdf', bytes([0x0a, 0x0a], '%PDF-1.4')),
    ).toBe(DocumentFileFormat.PDF);
  });

  it('accepts a CSV written with accented characters', () => {
    expect(
      detectDocumentFileFormat('frais.csv', bytes('libellé;montant\n', [0xc3, 0xa9])),
    ).toBe(DocumentFileFormat.CSV);
  });

  it.each([
    ['an image renamed as a PDF', 'arret.pdf', png],
    ['a PDF renamed as an image', 'photo.png', pdf],
    ['a Word package renamed as a spreadsheet', 'frais.xlsx', docx],
    ['a Word 97 file renamed as a spreadsheet', 'frais.xls', doc],
    ['a binary file renamed as a CSV', 'frais.csv', bytes([0x00, 0x01, 0x02, 0x41])],
    ['a PDF renamed as a CSV', 'frais.csv', pdf],
    ['a text file renamed as a PDF', 'arret.pdf', csv],
  ])('refuses %s', (_case, fileName, content) => {
    expect(() => detectDocumentFileFormat(fileName, content)).toThrow(
      ErrorCode.UNSUPPORTED_FILE_FORMAT,
    );
  });

  it.each(['programme.exe', 'archive.zip', 'note.txt', 'sans-extension', 'pdf'])(
    'refuses the extension of %s',
    (fileName) => {
      expect(() => detectDocumentFileFormat(fileName, pdf)).toThrow(
        ErrorCode.UNSUPPORTED_FILE_FORMAT,
      );
    },
  );

  it('refuses an empty file', () => {
    expect(() => detectDocumentFileFormat('arret.pdf', new Uint8Array())).toThrow(
      ErrorCode.UNSUPPORTED_FILE_FORMAT,
    );
  });
});
