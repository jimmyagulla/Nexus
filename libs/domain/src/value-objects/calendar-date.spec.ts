import { ErrorCode } from '../errors/error-code';
import { CalendarDate } from './calendar-date';

describe('CalendarDate', () => {
  it('parses a calendar day without time', () => {
    expect(CalendarDate.parse('2026-07-14').value).toBe('2026-07-14');
  });

  it('rejects an impossible date', () => {
    expect(() => CalendarDate.parse('2026-02-30')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });
});
