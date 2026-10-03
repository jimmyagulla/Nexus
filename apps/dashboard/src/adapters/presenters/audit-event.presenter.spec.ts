import { describe, expect, it } from 'vitest';
import {
  AuditAction,
  AuditSubject,
  holidayValue,
} from '@hexagonal-monorepo-template/domain';
import { formatAuditEventLine } from './audit-event.presenter';

describe('formatAuditEventLine', () => {
  it('forms a French line for holiday removal from typed values', () => {
    const line = formatAuditEventLine({
      action: AuditAction.SUPPRESSION,
      subject: AuditSubject.COMPANY_CALENDAR_HOLIDAY,
      before: holidayValue({
        id: 'h1',
        date: '2026-07-14',
        label: 'Fête nationale',
      }),
      after: null,
      occurredAt: new Date('2026-07-01'),
    });
    expect(line).toContain('Fête nationale');
    expect(line).toContain('2026-07-14');
  });
});
