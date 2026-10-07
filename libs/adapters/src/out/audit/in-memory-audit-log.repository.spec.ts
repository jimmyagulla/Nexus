import { describe, expect, it } from 'vitest';
import {
  AuditAction,
  AuditEvent,
  AuditSubject,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryAuditLogRepository } from './in-memory-audit-log.repository';

const occurredAt = new Date('2026-10-06T10:00:00.000Z');

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

describe('InMemoryAuditLogRepository', () => {
  it('lists an appended event back under its company', async () => {
    const audits = new InMemoryAuditLogRepository();
    const event = eventOf('a1', 'c1', 'Acme');

    await audits.append(event);

    expect(await audits.listByCompany('c1')).toEqual([event]);
  });

  it('lists every event of the same company', async () => {
    const audits = new InMemoryAuditLogRepository();
    const first = eventOf('a1', 'c1', 'Acme');
    const second = eventOf('a2', 'c1', 'Acme Corp');

    await audits.append(first);
    await audits.append(second);

    expect(await audits.listByCompany('c1')).toEqual([first, second]);
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

    expect(await audits.listByCompany('c1')).toEqual([ofFirst]);
    expect(await audits.listByCompany('c2')).toEqual([ofSecond]);
  });

  it('lists the events seeded through the injected collection', async () => {
    const seeded = eventOf('a1', 'c1', 'Acme');
    const audits = new InMemoryAuditLogRepository(new Map([['a1', seeded]]));

    expect(await audits.listByCompany('c1')).toEqual([seeded]);
  });
});
