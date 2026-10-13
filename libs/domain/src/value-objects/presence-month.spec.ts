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

  it('parses a calendar month', () => {
    const month = PresenceMonth.parse('2026-10');

    expect(month.value).toBe('2026-10');
    expect(month.year).toBe(2026);
    expect(month.month).toBe(10);
  });
});
