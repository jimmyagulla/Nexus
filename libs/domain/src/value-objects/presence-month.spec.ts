import { ErrorCode } from '../errors/error-code';
import { PresenceMonth } from './presence-month';

describe('PresenceMonth', () => {
  it('rejects a month outside the year', () => {
    expect(() => PresenceMonth.parse('2026-13')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('rejects a text that is not written year-month', () => {
    for (const raw of ['abc', '2026-1', '2026-10-05', '26-10', '']) {
      expect(() => PresenceMonth.parse(raw)).toThrow(
        ErrorCode.REQUIRED_INFORMATION,
      );
    }
  });

  it('lists every day of the month in order', () => {
    const days = PresenceMonth.parse('2026-10').days();

    expect(days).toHaveLength(31);
    expect(days[0]?.value).toBe('2026-10-01');
    expect(days[30]?.value).toBe('2026-10-31');
  });

  it('counts 28 days in February of an ordinary year', () => {
    expect(PresenceMonth.parse('2026-02').days()).toHaveLength(28);
  });

  it('counts 29 days in February of a leap year', () => {
    expect(PresenceMonth.parse('2028-02').days()).toHaveLength(29);
  });

  it('counts 30 days in April', () => {
    expect(PresenceMonth.parse('2026-04').days()).toHaveLength(30);
  });

  it('parses a calendar month', () => {
    const month = PresenceMonth.parse('2026-10');

    expect(month.value).toBe('2026-10');
    expect(month.year).toBe(2026);
    expect(month.month).toBe(10);
  });
});
