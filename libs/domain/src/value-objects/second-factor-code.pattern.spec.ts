import { SECOND_FACTOR_CODE_PATTERN } from './second-factor-code.pattern';

describe('SECOND_FACTOR_CODE_PATTERN', () => {
  it('accepts six digits', () => {
    expect(SECOND_FACTOR_CODE_PATTERN.test('287082')).toBe(true);
  });

  it('accepts a code that starts with zeros', () => {
    expect(SECOND_FACTOR_CODE_PATTERN.test('005924')).toBe(true);
  });

  it('refuses fewer or more than six digits', () => {
    expect(SECOND_FACTOR_CODE_PATTERN.test('28708')).toBe(false);
    expect(SECOND_FACTOR_CODE_PATTERN.test('2870820')).toBe(false);
  });

  it('refuses anything that is not a digit', () => {
    expect(SECOND_FACTOR_CODE_PATTERN.test('28708a')).toBe(false);
    expect(SECOND_FACTOR_CODE_PATTERN.test('287 082')).toBe(false);
  });

  it('refuses anything around the code', () => {
    expect(SECOND_FACTOR_CODE_PATTERN.test(' 287082')).toBe(false);
    expect(SECOND_FACTOR_CODE_PATTERN.test('287082\n')).toBe(false);
  });

  it('refuses an empty value', () => {
    expect(SECOND_FACTOR_CODE_PATTERN.test('')).toBe(false);
  });
});
