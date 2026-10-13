import { PRESENCE_MONTH_PATTERN } from './presence-month.pattern';

describe('PRESENCE_MONTH_PATTERN', () => {
  it('accepts a year and a zero-padded month of the year', () => {
    expect(PRESENCE_MONTH_PATTERN.test('2026-01')).toBe(true);
    expect(PRESENCE_MONTH_PATTERN.test('2026-12')).toBe(true);
  });

  it('refuses a month outside the year', () => {
    expect(PRESENCE_MONTH_PATTERN.test('2026-00')).toBe(false);
    expect(PRESENCE_MONTH_PATTERN.test('2026-13')).toBe(false);
  });

  it('refuses a month that is not zero-padded', () => {
    expect(PRESENCE_MONTH_PATTERN.test('2026-1')).toBe(false);
  });

  it('refuses a day after the month', () => {
    expect(PRESENCE_MONTH_PATTERN.test('2026-10-05')).toBe(false);
  });

  it('refuses anything around the month', () => {
    expect(PRESENCE_MONTH_PATTERN.test(' 2026-10')).toBe(false);
    expect(PRESENCE_MONTH_PATTERN.test('2026-10\n')).toBe(false);
  });

  it('refuses an empty value', () => {
    expect(PRESENCE_MONTH_PATTERN.test('')).toBe(false);
  });
});
