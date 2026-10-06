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

  it('rejects a name made of invisible characters', () => {
    expect(() => CompanyName.parse('\n\t  ')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('keeps the inner spacing of a company name', () => {
    expect(CompanyName.parse('  Acme  Corp  ').value).toBe('Acme  Corp');
  });

  it('keeps a single character name', () => {
    expect(CompanyName.parse('A').value).toBe('A');
  });
});
