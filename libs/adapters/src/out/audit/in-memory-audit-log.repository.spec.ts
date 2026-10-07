import { describe, expect, it } from 'vitest';
import {
  AuditAction,
  AuditEvent,
  AuditSubject,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryAuditLogRepository } from './in-memory-audit-log.repository';

const occurredAt = new Date('2026-10-06T10:00:00.000Z');

function listed(event: AuditEvent) {
  return {
    id: expect.stringMatching(ASSIGNED_ID),
    companyId: event.companyId,
    actorId: event.actorId,
    occurredAt: event.occurredAt,
    action: event.action,
    subject: event.subject,
    before: event.before,
    after: event.after,
  };
}

function eventOf(
  id: string,
  companyId: string,
  companyName: string,
): AuditEvent {
  return {
    id,
    companyId,
    actorId: 'user-1',
    occurredAt,
    action: AuditAction.MODIFICATION,
    subject: AuditSubject.COMPANY_NAME,
    before: null,
    after: { companyName },
  };
}

const ASSIGNED_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('InMemoryAuditLogRepository', () => {
  it('assigns an id when appending an event', async () => {
    const audits = new InMemoryAuditLogRepository();

    await audits.append({
      companyId: 'c1',
      actorId: 'user-1',
      occurredAt,
      action: AuditAction.MODIFICATION,
      subject: AuditSubject.COMPANY_NAME,
      before: null,
      after: { companyName: 'Acme' },
    });
    const [stored] = await audits.listByCompany('c1');

    expect(stored?.id).toMatch(ASSIGNED_ID);
    expect(stored).toMatchObject({
      companyId: 'c1',
      actorId: 'user-1',
      occurredAt,
      action: AuditAction.MODIFICATION,
      subject: AuditSubject.COMPANY_NAME,
      after: { companyName: 'Acme' },
    });
  });

  it('assigns a different id to each appended event', async () => {
    const audits = new InMemoryAuditLogRepository();
    const draft = {
      companyId: 'c1',
      actorId: 'user-1',
      occurredAt,
      action: AuditAction.MODIFICATION,
      subject: AuditSubject.COMPANY_NAME,
      before: null,
      after: { companyName: 'Acme' },
    };

    await audits.append(draft);
    await audits.append({ ...draft, after: { companyName: 'Acme Corp' } });
    const stored = await audits.listByCompany('c1');

    expect(stored).toHaveLength(2);
    expect(stored[0]?.id).not.toBe(stored[1]?.id);
  });

  it('lists an appended event back under its company', async () => {
    const audits = new InMemoryAuditLogRepository();
    const event = eventOf('a1', 'c1', 'Acme');

    await audits.append(event);

    expect(await audits.listByCompany('c1')).toEqual([listed(event)]);
  });

  it('lists every event of the same company', async () => {
    const audits = new InMemoryAuditLogRepository();
    const first = eventOf('a1', 'c1', 'Acme');
    const second = eventOf('a2', 'c1', 'Acme Corp');

    await audits.append(first);
    await audits.append(second);

    expect(await audits.listByCompany('c1')).toEqual([
      listed(first),
      listed(second),
    ]);
  });

  it('lists nothing from an empty log', async () => {
    const audits = new InMemoryAuditLogRepository();

    expect(await audits.listByCompany('c1')).toEqual([]);
  });

  it('lists nothing for a company that carries no event', async () => {
    const audits = new InMemoryAuditLogRepository();

    await audits.append(eventOf('a1', 'c1', 'Acme'));

    expect(await audits.listByCompany('c2')).toEqual([]);
  });

  it('keeps the events of two companies apart', async () => {
    const audits = new InMemoryAuditLogRepository();
    const ofFirst = eventOf('a1', 'c1', 'Acme');
    const ofSecond = eventOf('a2', 'c2', 'Globex');

    await audits.append(ofFirst);
    await audits.append(ofSecond);

    expect(await audits.listByCompany('c1')).toEqual([listed(ofFirst)]);
    expect(await audits.listByCompany('c2')).toEqual([listed(ofSecond)]);
  });

  it('lists the events seeded through the injected collection', async () => {
    const seeded = eventOf('a1', 'c1', 'Acme');
    const audits = new InMemoryAuditLogRepository(new Map([['a1', seeded]]));

    expect(await audits.listByCompany('c1')).toEqual([seeded]);
  });
});
