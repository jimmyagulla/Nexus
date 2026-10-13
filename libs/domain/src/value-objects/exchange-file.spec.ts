import { ErrorCode } from '../errors/error-code';
import { EXCHANGE_FILE_MIME_TYPES, ExchangeFile } from './exchange-file';

const bytes = new Uint8Array([1, 2, 3]);

describe('ExchangeFile', () => {
  it('accepts a PDF file', () => {
    const file = ExchangeFile.of('releve.pdf', 'application/pdf', bytes);

    expect(file.describe()).toEqual({
      fileName: 'releve.pdf',
      mimeType: 'application/pdf',
      size: 3,
    });
  });

  it('accepts a JPEG file', () => {
    expect(() =>
      ExchangeFile.of('scan.jpg', 'image/jpeg', bytes),
    ).not.toThrow();
  });

  it('accepts a PNG file', () => {
    expect(() => ExchangeFile.of('scan.png', 'image/png', bytes)).not.toThrow();
  });

  it('lists the accepted formats once, for every consumer', () => {
    expect(EXCHANGE_FILE_MIME_TYPES).toEqual([
      'application/pdf',
      'image/jpeg',
      'image/png',
    ]);
  });

  it('rejects an empty file', () => {
    expect(() =>
      ExchangeFile.of('releve.pdf', 'application/pdf', new Uint8Array()),
    ).toThrow(ErrorCode.INVALID_FILE);
  });

  it('rejects a format outside PDF, JPEG and PNG', () => {
    expect(() => ExchangeFile.of('notes.txt', 'text/plain', bytes)).toThrow(
      ErrorCode.INVALID_FILE,
    );
  });

  it('rejects a file without a name', () => {
    expect(() => ExchangeFile.of('  ', 'application/pdf', bytes)).toThrow(
      ErrorCode.INVALID_FILE,
    );
  });

  it('keeps its own copy of the content', () => {
    const source = new Uint8Array([1, 2, 3]);
    const file = ExchangeFile.of('releve.pdf', 'application/pdf', source);

    source[0] = 9;

    expect([...file.content]).toEqual([1, 2, 3]);
  });
});
