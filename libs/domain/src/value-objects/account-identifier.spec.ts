import { ErrorCode } from '../errors/error-code';
import { AccountIdentifier } from './account-identifier';

describe('AccountIdentifier', () => {
  it('keeps a filled identifier', () => {
    expect(AccountIdentifier.parse('founder').value).toBe('founder');
  });

  it('trims the identifier', () => {
    expect(AccountIdentifier.parse('  founder  ').value).toBe('founder');
  });

  it('rejects an empty identifier', () => {
    expect(() => AccountIdentifier.parse('')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('rejects an identifier made of spaces', () => {
    expect(() => AccountIdentifier.parse('   ')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });
});
