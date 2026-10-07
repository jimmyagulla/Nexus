import { readOptional } from './read-optional';

describe('readOptional', () => {
  it('returns a trimmed string', () => {
    expect(readOptional('  api  ')).toBe('api');
  });

  it('returns undefined when the value is missing', () => {
    expect(readOptional(undefined)).toBeUndefined();
  });

  it('returns undefined when the value is blank', () => {
    expect(readOptional('')).toBeUndefined();
    expect(readOptional('   ')).toBeUndefined();
  });
});
