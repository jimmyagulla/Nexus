import { describe, expect, it } from 'vitest';
import {
  AuditAction,
  AuditEvent,
  AuditSubject,
  DayOfWeek,
} from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaAuditLogRepository } from './prisma-audit-log.repository';

const ASSIGNED_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type SnapshotCreate = {
  id?: string;
  side: 'BEFORE' | 'AFTER';
  companyName?: string;
  publicHolidayId?: string;
  holidayDate?: string;
  holidayLabel?: string;
  daysOfWeek?: { create: { dayOfWeek: DayOfWeek }[] };
};

type EventCreateArgs = {
  data: {
    id?: string;
    companyId: string;
    actorId: string;
    occurredAt: Date;
    action: AuditAction;
    subject: AuditSubject;
    snapshots: { create: SnapshotCreate[] };
  };
};

type SnapshotRow = {
  id: string;
  side: 'BEFORE' | 'AFTER';
  companyName: string | null;
  publicHolidayId: string | null;
  holidayDate: string | null;
  holidayLabel: string | null;
  daysOfWeek: { dayOfWeek: DayOfWeek }[];
};

type EventRow = {
  id: string;
  companyId: string;
  actorId: string;
  occurredAt: Date;
  action: AuditAction;
  subject: AuditSubject;
  snapshots: SnapshotRow[];
};

type FakePrisma = {
  client: PrismaDb;
  rows: EventRow[];
  created: EventCreateArgs[];
};

function toSnapshotRow(snapshot: SnapshotCreate): SnapshotRow {
  return {
    id: snapshot.id ?? globalThis.crypto.randomUUID(),
    side: snapshot.side,
    companyName: snapshot.companyName ?? null,
    publicHolidayId: snapshot.publicHolidayId ?? null,
    holidayDate: snapshot.holidayDate ?? null,
    holidayLabel: snapshot.holidayLabel ?? null,
    daysOfWeek: snapshot.daysOfWeek?.create ?? [],
  };
}

function createFakePrisma(): FakePrisma {
  const rows: EventRow[] = [];
  const created: EventCreateArgs[] = [];

  const client = {
    auditEvent: {
      create: async (args: EventCreateArgs): Promise<void> => {
        created.push(args);
        const { snapshots, id, ...event } = args.data;
        rows.push({
          ...event,
          id: id ?? globalThis.crypto.randomUUID(),
          snapshots: snapshots.create.map(toSnapshotRow),
        });
      },
      findMany: async (args: {
        where: { companyId: string };
      }): Promise<EventRow[]> =>
        rows
          .filter((row) => row.companyId === args.where.companyId)
          .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime()),
    },
  };

  return { client: client as unknown as PrismaDb, rows, created };
}

function eventOf(overrides: Partial<AuditEvent> = {}): AuditEvent {
  return {
    id: 'event-1',
    companyId: 'company-1',
    actorId: 'user-1',
    occurredAt: new Date('2026-03-01T10:00:00.000Z'),
    action: AuditAction.MODIFICATION,
    subject: AuditSubject.COMPANY_NAME,
    before: { companyName: 'Acme' },
    after: { companyName: 'Acme Europe' },
    ...overrides,
  };
}

describe('PrismaAuditLogRepository', () => {
  it('reads back the event it has just appended', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAuditLogRepository(client);
    const event = eventOf();

    await repository.append(event);
    const [stored] = await repository.listByCompany('company-1');

    expect(stored?.id).toMatch(ASSIGNED_ID);
    expect(stored).toMatchObject({
      companyId: event.companyId,
      actorId: event.actorId,
      occurredAt: event.occurredAt,
      action: event.action,
      subject: event.subject,
      before: event.before,
      after: event.after,
    });
  });

  it('omits identifiers so the database default applies', async () => {
    const { client, created } = createFakePrisma();

    await new PrismaAuditLogRepository(client).append(eventOf());

    expect(created[0]?.data.id).toBeUndefined();
    expect(
      created[0]?.data.snapshots.create.map((snapshot) => snapshot.id),
    ).toEqual([undefined, undefined]);
  });

  it('stores one record per side with a database id', async () => {
    const { client, rows } = createFakePrisma();

    await new PrismaAuditLogRepository(client).append(eventOf());
    const ids = rows[0]?.snapshots.map((snapshot) => snapshot.id) ?? [];

    expect(ids).toHaveLength(2);
    expect(ids[0]).toMatch(ASSIGNED_ID);
    expect(ids[1]).toMatch(ASSIGNED_ID);
    expect(ids[0]).not.toBe(ids[1]);
  });

  it('keeps the days of week carried by a snapshot', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAuditLogRepository(client);

    await repository.append(
      eventOf({
        subject: AuditSubject.COMPANY_NON_WORKING_WEEKDAY,
        before: { daysOfWeek: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY] },
        after: { daysOfWeek: [DayOfWeek.WEDNESDAY] },
      }),
    );
    const [stored] = await repository.listByCompany('company-1');

    expect(stored?.before?.daysOfWeek).toEqual([
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ]);
    expect(stored?.after?.daysOfWeek).toEqual([DayOfWeek.WEDNESDAY]);
  });

  it('keeps the holiday fields carried by a snapshot', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAuditLogRepository(client);

    await repository.append(
      eventOf({
        action: AuditAction.ADDITION,
        subject: AuditSubject.COMPANY_PUBLIC_HOLIDAY,
        before: null,
        after: {
          publicHolidayId: 'holiday-1',
          holidayDate: '2026-07-14',
          holidayLabel: 'Fête',
        },
      }),
    );
    const [stored] = await repository.listByCompany('company-1');

    expect(stored?.after).toEqual({
      companyName: undefined,
      publicHolidayId: 'holiday-1',
      holidayDate: '2026-07-14',
      holidayLabel: 'Fête',
      daysOfWeek: undefined,
    });
  });

  it('reports an absent side as no snapshot', async () => {
    const { client, rows } = createFakePrisma();
    const repository = new PrismaAuditLogRepository(client);

    await repository.append(eventOf({ before: null, after: null }));
    const [stored] = await repository.listByCompany('company-1');

    expect(rows[0]?.snapshots).toEqual([]);
    expect(stored?.before).toBeNull();
    expect(stored?.after).toBeNull();
  });

  it('reports only the recorded side when the other one is absent', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAuditLogRepository(client);

    await repository.append(
      eventOf({ before: null, after: { companyName: 'Acme' } }),
    );
    const [stored] = await repository.listByCompany('company-1');

    expect(stored?.before).toBeNull();
    expect(stored?.after).toMatchObject({ companyName: 'Acme' });
  });

  it('lists nothing for a company without event', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAuditLogRepository(client);

    await repository.append(eventOf());

    await expect(repository.listByCompany('company-2')).resolves.toEqual([]);
  });

  it('lists the events of a company from the oldest to the newest', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAuditLogRepository(client);

    await repository.append(
      eventOf({
        id: 'event-late',
        occurredAt: new Date('2026-03-02T10:00:00.000Z'),
      }),
    );
    await repository.append(
      eventOf({
        id: 'event-early',
        occurredAt: new Date('2026-03-01T10:00:00.000Z'),
      }),
    );
    await repository.append(
      eventOf({
        id: 'event-other-company',
        companyId: 'company-2',
        occurredAt: new Date('2026-01-01T10:00:00.000Z'),
      }),
    );

    await expect(
      repository
        .listByCompany('company-1')
        .then((events) =>
          events.map((event) => event.occurredAt.toISOString()),
        ),
    ).resolves.toEqual([
      '2026-03-01T10:00:00.000Z',
      '2026-03-02T10:00:00.000Z',
    ]);
  });
});
