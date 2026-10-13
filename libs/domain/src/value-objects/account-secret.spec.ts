import { ErrorCode } from '../errors/error-code';
import { AccountSecret } from './account-secret';

describe('AccountSecret', () => {
  it('keeps a filled secret', () => {
    expect(AccountSecret.parse('s3cret').value).toBe('s3cret');
  });

  it('trims the secret', () => {
    expect(AccountSecret.parse('  s3cret  ').value).toBe('s3cret');
  });

  it('rejects an empty secret', () => {
    expect(() => AccountSecret.parse('')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('rejects a secret made of spaces', () => {
    expect(() => AccountSecret.parse('   ')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });
});
