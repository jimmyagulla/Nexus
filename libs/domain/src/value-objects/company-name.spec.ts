import { ErrorCode } from '../errors/error-code';
import { CompanyName } from './company-name';

describe('CompanyName', () => {
  it('rejects an empty name', () => {
    expect(() => CompanyName.parse('')).toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('rejects a blank name', () => {
    expect(() => CompanyName.parse('   ')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('keeps a trimmed company name', () => {
    expect(CompanyName.parse('  Acme  ').value).toBe('Acme');
  });
});
