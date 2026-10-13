import { CabinetExchange } from '../entities/cabinet-exchange';
import { ErrorCode } from '../errors/error-code';
import { completeExchange } from './complete-exchange';

const at = new Date('2026-10-06T10:00:00.000Z');
const draft = CabinetExchange.draft('ex-1', 'c1', 'user-1', at);

const pdf = {
  fileName: 'a.pdf',
  mimeType: 'application/pdf',
  content: new Uint8Array([1]),
};

describe('completeExchange', () => {
  it('changes nothing when nothing is given', () => {
    const { exchange, file } = completeExchange(draft, {});

    expect(exchange).toBe(draft);
    expect(file).toBeNull();
  });

  it('chooses the category and attaches the file', () => {
    const { exchange, file } = completeExchange(draft, {
      category: 'Facture',
      file: pdf,
    });

    expect(exchange.category?.value).toBe('Facture');
    expect(exchange.document?.fileName).toBe('a.pdf');
    expect(file?.fileName).toBe('a.pdf');
  });

  it('treats a null category and a null file as not given', () => {
    const { exchange, file } = completeExchange(draft, {
      category: null,
      file: null,
    });

    expect(exchange).toBe(draft);
    expect(file).toBeNull();
  });

  it('refuses an invalid file', () => {
    expect(() =>
      completeExchange(draft, { file: { ...pdf, mimeType: 'text/plain' } }),
    ).toThrow(ErrorCode.INVALID_FILE);
  });

  it('refuses a blank category', () => {
    expect(() => completeExchange(draft, { category: ' ' })).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });
});
