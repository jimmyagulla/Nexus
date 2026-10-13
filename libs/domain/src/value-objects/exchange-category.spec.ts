import { ErrorCode } from '../errors/error-code';
import { ExchangeCategory } from './exchange-category';

describe('ExchangeCategory', () => {
  it('keeps a trimmed category label', () => {
    expect(ExchangeCategory.parse('  Facture  ').value).toBe('Facture');
  });

  it('rejects a blank category', () => {
    expect(() => ExchangeCategory.parse('   ')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });
});
