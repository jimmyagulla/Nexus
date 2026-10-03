import { AuditSubject } from './audit-subject';
import { type Weekday } from '../value-objects/weekday';

export type CompanyNameAuditValue = {
  kind: typeof AuditSubject.COMPANY_NAME;
  name: string;
};

export type NonWorkingWeekdaysAuditValue = {
  kind: typeof AuditSubject.COMPANY_CALENDAR_NON_WORKING_WEEKDAYS;
  weekdays: Weekday[];
};

export type HolidayAuditValue = {
  kind: typeof AuditSubject.COMPANY_CALENDAR_HOLIDAY;
  id: string;
  date: string;
  label: string;
};

export type AuditValue =
  | CompanyNameAuditValue
  | NonWorkingWeekdaysAuditValue
  | HolidayAuditValue;

export function companyNameValue(name: string): CompanyNameAuditValue {
  return { kind: AuditSubject.COMPANY_NAME, name };
}

export function nonWorkingWeekdaysValue(
  weekdays: Weekday[],
): NonWorkingWeekdaysAuditValue {
  return {
    kind: AuditSubject.COMPANY_CALENDAR_NON_WORKING_WEEKDAYS,
    weekdays: [...weekdays],
  };
}

export function holidayValue(props: {
  id: string;
  date: string;
  label: string;
}): HolidayAuditValue {
  return {
    kind: AuditSubject.COMPANY_CALENDAR_HOLIDAY,
    id: props.id,
    date: props.date,
    label: props.label,
  };
}

export function parseAuditValue(raw: string): AuditValue | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null || !('kind' in parsed)) {
    return null;
  }
  const kind = parsed.kind;
  if (kind === AuditSubject.COMPANY_NAME && 'name' in parsed) {
    const name = parsed.name;
    if (typeof name === 'string') {
      return { kind: AuditSubject.COMPANY_NAME, name };
    }
  }
  if (
    kind === AuditSubject.COMPANY_CALENDAR_NON_WORKING_WEEKDAYS &&
    'weekdays' in parsed &&
    Array.isArray(parsed.weekdays)
  ) {
    return {
      kind: AuditSubject.COMPANY_CALENDAR_NON_WORKING_WEEKDAYS,
      weekdays: parsed.weekdays.filter(
        (value): value is Weekday =>
          typeof value === 'number' && value >= 0 && value <= 6,
      ),
    };
  }
  if (kind === AuditSubject.COMPANY_CALENDAR_HOLIDAY) {
    const record = parsed as Record<string, unknown>;
    const { id, date, label } = record;
    if (
      typeof id === 'string' &&
      typeof date === 'string' &&
      typeof label === 'string'
    ) {
      return {
        kind: AuditSubject.COMPANY_CALENDAR_HOLIDAY,
        id,
        date,
        label,
      };
    }
  }
  return null;
}

export function serializeAuditValue(value: AuditValue): string {
  return JSON.stringify(value);
}
