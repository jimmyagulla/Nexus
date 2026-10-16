import { ErrorCode } from '../errors/error-code';
import { DocumentCategory } from '../value-objects/document-category';
import { DocumentFileFormat } from '../value-objects/document-file-format';
import {
  DOCUMENT_COMMENT_MAX_LENGTH,
  DOCUMENT_MAX_FILE_SIZE_BYTES,
  DOCUMENT_MAX_FILES_PER_DEPOSIT,
  DOCUMENT_NAME_MAX_LENGTH,
} from '../value-objects/document-limits';
import { prepareDocumentDeposit } from './prepare-document-deposit';

const pdf = Uint8Array.from([...'%PDF-1.7\n'].map((c) => c.charCodeAt(0)));

function file(overrides: Partial<{ name: string; fileName: string; content: Uint8Array }> = {}) {
  return { name: 'Arrêt du 2 octobre', fileName: 'arret.pdf', content: pdf, ...overrides };
}

function sized(size: number): Uint8Array {
  const content = new Uint8Array(size);
  content.set(pdf);
  return content;
}

describe('prepareDocumentDeposit', () => {
  it('prepares one document per file, sharing the type and the comment', () => {
    const deposit = prepareDocumentDeposit({
      category: DocumentCategory.SICK_LEAVE,
      comment: '  Arrêt prescrit du 02/10 au 09/10.  ',
      files: [file(), file({ name: 'Prolongation', fileName: 'prolongation.pdf' })],
    });

    expect(deposit.category).toBe(DocumentCategory.SICK_LEAVE);
    expect(deposit.comment?.value).toBe('Arrêt prescrit du 02/10 au 09/10.');
    expect(
      deposit.files.map((f) => ({ name: f.name.value, format: f.format, sizeBytes: f.sizeBytes })),
    ).toEqual([
      { name: 'Arrêt du 2 octobre', format: DocumentFileFormat.PDF, sizeBytes: pdf.length },
      { name: 'Prolongation', format: DocumentFileFormat.PDF, sizeBytes: pdf.length },
    ]);
  });

  it('keeps no comment when it is blank', () => {
    expect(
      prepareDocumentDeposit({ category: DocumentCategory.OTHER, comment: '   ', files: [file()] })
        .comment,
    ).toBeNull();
  });

  it('accepts a file of exactly the largest size', () => {
    expect(
      prepareDocumentDeposit({
        category: DocumentCategory.OTHER,
        comment: null,
        files: [file({ content: sized(DOCUMENT_MAX_FILE_SIZE_BYTES) })],
      }).files[0].sizeBytes,
    ).toBe(DOCUMENT_MAX_FILE_SIZE_BYTES);
  });

  it('refuses a file one byte above the largest size', () => {
    expect(() =>
      prepareDocumentDeposit({
        category: DocumentCategory.OTHER,
        comment: null,
        files: [file({ content: sized(DOCUMENT_MAX_FILE_SIZE_BYTES + 1) })],
      }),
    ).toThrow(ErrorCode.FILE_TOO_LARGE);
  });

  it('refuses a deposit without file', () => {
    expect(() =>
      prepareDocumentDeposit({ category: DocumentCategory.OTHER, comment: null, files: [] }),
    ).toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('refuses a deposit carrying too many files', () => {
    expect(() =>
      prepareDocumentDeposit({
        category: DocumentCategory.OTHER,
        comment: null,
        files: Array.from({ length: DOCUMENT_MAX_FILES_PER_DEPOSIT + 1 }, () => file()),
      }),
    ).toThrow(ErrorCode.INVALID_INFORMATION);
  });

  it('refuses a missing type', () => {
    expect(() => prepareDocumentDeposit({ category: '', comment: null, files: [file()] })).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('refuses an unknown type', () => {
    expect(() =>
      prepareDocumentDeposit({ category: 'PAYSLIP', comment: null, files: [file()] }),
    ).toThrow(ErrorCode.INVALID_INFORMATION);
  });

  it('refuses a name longer than the limit', () => {
    expect(() =>
      prepareDocumentDeposit({
        category: DocumentCategory.OTHER,
        comment: null,
        files: [file({ name: 'n'.repeat(DOCUMENT_NAME_MAX_LENGTH + 1) })],
      }),
    ).toThrow(ErrorCode.INVALID_INFORMATION);
  });

  it('refuses a blank name', () => {
    expect(() =>
      prepareDocumentDeposit({ category: DocumentCategory.OTHER, comment: null, files: [file({ name: '  ' })] }),
    ).toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('refuses a comment longer than the limit', () => {
    expect(() =>
      prepareDocumentDeposit({
        category: DocumentCategory.OTHER,
        comment: 'c'.repeat(DOCUMENT_COMMENT_MAX_LENGTH + 1),
        files: [file()],
      }),
    ).toThrow(ErrorCode.INVALID_INFORMATION);
  });

  it('refuses a file whose content does not match its extension', () => {
    expect(() =>
      prepareDocumentDeposit({
        category: DocumentCategory.OTHER,
        comment: null,
        files: [file({ fileName: 'arret.png' })],
      }),
    ).toThrow(ErrorCode.UNSUPPORTED_FILE_FORMAT);
  });

  it('refuses an empty file', () => {
    expect(() =>
      prepareDocumentDeposit({
        category: DocumentCategory.OTHER,
        comment: null,
        files: [file({ content: new Uint8Array() })],
      }),
    ).toThrow(ErrorCode.REQUIRED_INFORMATION);
  });
});
