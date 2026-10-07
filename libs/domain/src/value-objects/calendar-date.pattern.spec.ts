import { CALENDAR_DATE_PATTERN } from './calendar-date.pattern';

describe('CALENDAR_DATE_PATTERN', () => {
  it('accepts a zero-padded year, month and day', () => {
    expect(CALENDAR_DATE_PATTERN.test('2026-07-14')).toBe(true);
    expect(CALENDAR_DATE_PATTERN.test('2026-01-01')).toBe(true);
  });

  it('refuses a month or a day that is not zero-padded', () => {
    expect(CALENDAR_DATE_PATTERN.test('2026-7-14')).toBe(false);
    expect(CALENDAR_DATE_PATTERN.test('2026-07-4')).toBe(false);
  });

  it('refuses a year that is not written in full', () => {
    expect(CALENDAR_DATE_PATTERN.test('26-07-14')).toBe(false);
  });

  it('refuses another separator', () => {
    expect(CALENDAR_DATE_PATTERN.test('2026/07/14')).toBe(false);
  });

  it('refuses anything around the calendar day', () => {
    expect(CALENDAR_DATE_PATTERN.test('2026-07-14T00:00:00Z')).toBe(false);
    expect(CALENDAR_DATE_PATTERN.test('2026-07-14 ')).toBe(false);
    expect(CALENDAR_DATE_PATTERN.test('2026-07-14\n')).toBe(false);
  });

  it('refuses an empty value', () => {
    expect(CALENDAR_DATE_PATTERN.test('')).toBe(false);
  });

  it('checks the shape only and leaves the existence of the day to CalendarDate', () => {
    expect(CALENDAR_DATE_PATTERN.test('2026-99-99')).toBe(true);
  });
});
