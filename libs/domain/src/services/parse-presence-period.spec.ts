import { ErrorCode } from '../errors/error-code';
import { parsePresencePeriod } from './parse-presence-period';

describe('parsePresencePeriod', () => {
  it('leaves both bounds open when none is given', () => {
    expect(parsePresencePeriod(undefined, undefined)).toEqual({
      from: undefined,
      to: undefined,
    });
  });

  it('reads the months written as bounds', () => {
    const period = parsePresencePeriod('2026-08', '2026-10');

    expect(period.from?.value).toBe('2026-08');
    expect(period.to?.value).toBe('2026-10');
  });

  it('accepts a single bound', () => {
    expect(parsePresencePeriod('2026-08', undefined).to).toBeUndefined();
    expect(parsePresencePeriod(undefined, '2026-08').from).toBeUndefined();
  });

  it('accepts a period that starts and ends the same month', () => {
    expect(() => parsePresencePeriod('2026-09', '2026-09')).not.toThrow();
  });

  it('refuses a period whose end precedes its start', () => {
    expect(() => parsePresencePeriod('2026-10', '2026-09')).toThrow(
      ErrorCode.INVALID_PERIOD,
    );
  });

  it('compares the bounds across years', () => {
    expect(() => parsePresencePeriod('2027-01', '2026-12')).toThrow(
      ErrorCode.INVALID_PERIOD,
    );
    expect(() => parsePresencePeriod('2026-12', '2027-01')).not.toThrow();
  });

  it('refuses a bound that is not a calendar month', () => {
    expect(() => parsePresencePeriod('2026-13', undefined)).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
    expect(() => parsePresencePeriod(undefined, 'october')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });
});
