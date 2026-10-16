import { describe, expect, it } from 'vitest';
import {
  DocumentCategory,
  DocumentEmitter,
  DocumentFileFormat,
  DocumentListCriteria,
  DocumentName,
  DocumentSort,
  DocumentStatus,
} from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaDocumentRepository } from './prisma-document.repository';
import { PrismaDocumentRow } from './prisma-document.mapper';

const row: PrismaDocumentRow = {
  id: 'd1', companyId: 'c1', ownerId: 'u1', uploadedById: 'u1', name: 'Arrêt', category: DocumentCategory.SICK_LEAVE,
  status: DocumentStatus.PENDING, format: DocumentFileFormat.PDF, sizeBytes: 12, comment: null,
  storageKey: 'c1/u1/k', createdAt: new Date('2026-10-03T10:24:00Z'),
};

const everything: DocumentListCriteria = {
  search: '', searchCategories: [], searchEmitters: [], categories: [], statuses: [], emitters: [],
  from: null, to: null, sort: DocumentSort.DATE,
};

type Recorded = { findMany: unknown[]; update: unknown[]; create: unknown[] };

function fakePrisma(): { client: PrismaDb; recorded: Recorded } {
  const recorded: Recorded = { findMany: [], update: [], create: [] };
  const client = {
    $transaction: async (operations: Promise<unknown>[]) => Promise.all(operations),
    document: {
      create: async (args: { data: Omit<PrismaDocumentRow, 'id'> }) => {
        recorded.create.push(args);
        return { ...args.data, id: `id-${recorded.create.length}` };
      },
      update: async (args: unknown) => {
        recorded.update.push(args);
      },
      findUnique: async (args: { where: { id: string } }) => (args.where.id === 'd1' ? row : null),
      findMany: async (args: unknown) => {
        recorded.findMany.push(args);
        return [row];
      },
      groupBy: async (args: { by: string[] }) =>
        args.by[0] === 'category'
          ? [{ category: DocumentCategory.SICK_LEAVE, _count: { _all: 3 } }, { category: DocumentCategory.PROOF, _count: { _all: 1 } }]
          : [{ status: DocumentStatus.PENDING, _count: { _all: 4 } }],
    },
  };
  return { client: client as unknown as PrismaDb, recorded };
}

describe('PrismaDocumentRepository', () => {
  it('lists the summaries of the owner with the counts per category and status', async () => {
    const { client } = fakePrisma();

    const list = await new PrismaDocumentRepository(client).list({ companyId: 'c1', ownerId: 'u1' }, everything);

    expect(list).toEqual({
      items: [{
        id: 'd1', name: 'Arrêt', category: 'SICK_LEAVE', status: 'PENDING', format: 'PDF', sizeBytes: 12,
        emitter: 'SELF', comment: null, createdAt: '2026-10-03T10:24:00.000Z',
      }],
      total: 4,
      categoryCounts: { SICK_LEAVE: 3, OTHER: 0, ADMINISTRATIVE: 0, PROOF: 1 },
      statusCounts: { SEEN: 0, PENDING: 4, NEW: 0, PROCESSED: 0 },
    });
  });

  it('translates every criterion into one query on the owner documents', async () => {
    const { client, recorded } = fakePrisma();

    await new PrismaDocumentRepository(client).list(
      { companyId: 'c1', ownerId: 'u1' },
      {
        search: ' arrêt ', searchCategories: [DocumentCategory.SICK_LEAVE], searchEmitters: [DocumentEmitter.HR],
        categories: [DocumentCategory.SICK_LEAVE], statuses: [DocumentStatus.NEW], emitters: [DocumentEmitter.SELF],
        from: '2026-10-01', to: '2026-10-31', sort: DocumentSort.SIZE,
      },
    );

    expect(recorded.findMany).toEqual([{
      where: {
        companyId: 'c1',
        ownerId: 'u1',
        AND: [
          { OR: [
            { name: { contains: 'arrêt', mode: 'insensitive' } },
            { category: { in: ['SICK_LEAVE'] } },
            { uploadedById: { not: 'u1' } },
          ] },
          { category: { in: ['SICK_LEAVE'] } },
          { status: { in: ['NEW'] } },
          { OR: [{ uploadedById: 'u1' }] },
          { createdAt: { gte: new Date('2026-10-01T00:00:00.000Z') } },
          { createdAt: { lt: new Date('2026-11-01T00:00:00.000Z') } },
        ],
      },
      orderBy: [{ sizeBytes: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
    }]);
  });

  it('records every document of a deposit in one transaction', async () => {
    const { client, recorded } = fakePrisma();

    const inserted = await new PrismaDocumentRepository(client).insertAll([
      { ...row, name: DocumentName.parse('A'), comment: null },
      { ...row, name: DocumentName.parse('B'), comment: null, storageKey: 'c1/u1/k2' },
    ]);

    expect(inserted.map((document) => document.id)).toEqual(['id-1', 'id-2']);
    expect(recorded.create).toHaveLength(2);
  });

  it('saves the status of a viewed document', async () => {
    const { client, recorded } = fakePrisma();
    const repository = new PrismaDocumentRepository(client);
    const document = await repository.findById('d1');
    if (document === null) {
      throw new Error('the seeded document is missing');
    }

    await repository.save(document.view());

    expect(recorded.update).toEqual([{ where: { id: 'd1' }, data: { status: 'SEEN', name: 'Arrêt' } }]);
  });

  it('hands back nothing for an unknown document', async () => {
    await expect(new PrismaDocumentRepository(fakePrisma().client).findById('missing')).resolves.toBeNull();
  });
});
