import { ErrorCode } from '../errors/error-code';
import { requireText, requireValid } from './text-rules';

describe('requireText', () => {
  it('keeps a filled text, trimmed', () => {
    expect(requireText('  Acme  ')).toBe('Acme');
  });

  it('refuses a blank text', () => {
    expect(() => requireText(' \n ')).toThrow(ErrorCode.REQUIRED_INFORMATION);
  });
});

describe('requireValid', () => {
  it('keeps a value that meets its rule, refuses one that does not', () => {
    expect(requireValid('a', true)).toBe('a');
    expect(() => requireValid('a', false)).toThrow(ErrorCode.INVALID_INFORMATION);
  });
});
