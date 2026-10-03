import { describe, expect, it } from 'vitest';
import { Weekday } from '../value-objects/weekday';
import {
  holidayValue,
  parseAuditValue,
  serializeAuditValue,
} from './audit-value';

describe('AuditValue serialization', () => {
  it('round-trips a holiday value as JSON without prose', () => {
    const value = holidayValue({
      id: 'holiday-1',
      date: '2026-07-14',
      label: '14-juillet',
    });
    const raw = serializeAuditValue(value);
    expect(raw).not.toMatch(/\s+a\s+/);
    expect(parseAuditValue(raw)).toEqual(value);
  });

  it('round-trips weekdays', () => {
    const value = {
      kind: 'COMPANY_CALENDAR_NON_WORKING_WEEKDAYS' as const,
      weekdays: [Weekday.SATURDAY, Weekday.SUNDAY],
    };
    const parsed = parseAuditValue(serializeAuditValue(value));
    expect(parsed).toEqual(value);
  });
});
