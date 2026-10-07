import { ErrorCode } from '../errors/error-code';
import { CalendarDate } from './calendar-date';

describe('CalendarDate', () => {
  it('parses a calendar day without time', () => {
    expect(CalendarDate.parse('2026-07-14').value).toBe('2026-07-14');
  });

  it('parses the first and the last day of a year', () => {
    expect(CalendarDate.parse('2026-01-01').value).toBe('2026-01-01');
    expect(CalendarDate.parse('2026-12-31').value).toBe('2026-12-31');
  });

  it('parses the extra day of a leap year', () => {
    expect(CalendarDate.parse('2024-02-29').value).toBe('2024-02-29');
  });

  it('rejects the 29th of February outside a leap year', () => {
    expect(() => CalendarDate.parse('2025-02-29')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('rejects an impossible date', () => {
    expect(() => CalendarDate.parse('2026-02-30')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('rejects a month outside the year', () => {
    expect(() => CalendarDate.parse('2026-00-10')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
    expect(() => CalendarDate.parse('2026-13-01')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('rejects a day outside the month', () => {
    expect(() => CalendarDate.parse('2026-07-00')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
    expect(() => CalendarDate.parse('2026-07-32')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('rejects a year the calendar cannot represent without remapping it', () => {
    expect(() => CalendarDate.parse('0099-01-01')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('rejects a value that is not a bare calendar day', () => {
    expect(() => CalendarDate.parse('')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
    expect(() => CalendarDate.parse('14/07/2026')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
    expect(() => CalendarDate.parse('2026-07-14T10:00:00Z')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('considers two dates equal when they name the same day', () => {
    expect(
      CalendarDate.parse('2026-07-14').equals(CalendarDate.parse('2026-07-14')),
    ).toBe(true);
  });

  it('considers two dates different when they name another day', () => {
    expect(
      CalendarDate.parse('2026-07-14').equals(CalendarDate.parse('2026-07-15')),
    ).toBe(false);
  });
});
