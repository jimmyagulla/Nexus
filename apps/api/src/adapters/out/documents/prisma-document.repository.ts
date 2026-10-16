import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_STATUSES,
  Document,
  DocumentCategory,
  DocumentEmitter,
  DocumentList,
  DocumentListCriteria,
  DocumentListScope,
  DocumentSort,
  DocumentSortDirection,
  DocumentStatus,
  toDocumentSummary,
} from '@hexagonal-monorepo-template/domain';
import {
  IDocumentRepository,
  NewDocument,
} from '@hexagonal-monorepo-template/ports';
import { Prisma } from '../../../infrastructure/prisma/prisma-client';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { toDocument, toDocumentColumns } from './prisma-document.mapper';

const DAY_MS = 24 * 60 * 60 * 1000;

export class PrismaDocumentRepository implements IDocumentRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async insertAll(documents: readonly NewDocument[]): Promise<Document[]> {
    const rows = await this.prisma.$transaction(
      documents.map((document) =>
        this.prisma.document.create({ data: toDocumentColumns(document) }),
      ),
    );
    return rows.map(toDocument);
  }

  async save(document: Document): Promise<void> {
    await this.prisma.document.update({
      where: { id: document.id },
      data: { status: document.status, name: document.name.value },
    });
  }

  async findById(documentId: string): Promise<Document | null> {
    const row = await this.prisma.document.findUnique({
      where: { id: documentId },
    });
    return row === null ? null : toDocument(row);
  }

  async list(
    scope: DocumentListScope,
    criteria: DocumentListCriteria,
  ): Promise<DocumentList> {
    const owned = { companyId: scope.companyId, ownerId: scope.ownerId };
    const [rows, perCategory, perStatus] = await Promise.all([
      this.prisma.document.findMany({
        where: { ...owned, AND: this.conditionsOf(scope, criteria) },
        orderBy: this.orderOf(criteria.sort, criteria.direction),
      }),
      this.prisma.document.groupBy({ by: ['category'], where: owned, _count: { _all: true } }),
      this.prisma.document.groupBy({ by: ['status'], where: owned, _count: { _all: true } }),
    ]);
    const categoryCounts = this.countsOf(DOCUMENT_CATEGORIES, perCategory.map((g) => [g.category, g._count._all]));
    return {
      items: rows.map((row) => toDocumentSummary(toDocument(row))),
      total: Object.values(categoryCounts).reduce((sum, count) => sum + count, 0),
      categoryCounts,
      statusCounts: this.countsOf(DOCUMENT_STATUSES, perStatus.map((g) => [g.status, g._count._all])),
    };
  }

  private conditionsOf(
    scope: DocumentListScope,
    criteria: DocumentListCriteria,
  ): Prisma.DocumentWhereInput[] {
    const conditions: Prisma.DocumentWhereInput[] = [];
    const search = criteria.search.trim();
    if (search !== '') {
      conditions.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { category: { in: [...criteria.searchCategories] } },
          ...criteria.searchEmitters.map((emitter) => this.emittedBy(scope, emitter)),
        ],
      });
    }
    if (criteria.categories.length > 0) {
      conditions.push({ category: { in: [...criteria.categories] } });
    }
    if (criteria.statuses.length > 0) {
      conditions.push({ status: { in: [...criteria.statuses] } });
    }
    if (criteria.emitters.length > 0) {
      conditions.push({ OR: criteria.emitters.map((emitter) => this.emittedBy(scope, emitter)) });
    }
    if (criteria.from !== null) {
      conditions.push({ createdAt: { gte: new Date(`${criteria.from}T00:00:00.000Z`) } });
    }
    if (criteria.to !== null) {
      conditions.push({
        createdAt: { lt: new Date(new Date(`${criteria.to}T00:00:00.000Z`).getTime() + DAY_MS) },
      });
    }
    return conditions;
  }

  /** The owner deposited the document themself, or someone from HR did. */
  private emittedBy(
    scope: DocumentListScope,
    emitter: DocumentEmitter,
  ): Prisma.DocumentWhereInput {
    return emitter === DocumentEmitter.SELF
      ? { uploadedById: scope.ownerId }
      : { uploadedById: { not: scope.ownerId } };
  }

  /** The database enums are declared in the domain sort order. */
  private orderOf(
    sort: DocumentSort,
    direction: DocumentSortDirection,
  ): Prisma.DocumentOrderByWithRelationInput[] {
    const order = direction === DocumentSortDirection.ASC ? 'asc' : 'desc';
    const tieBreak: Prisma.DocumentOrderByWithRelationInput[] = [
      { createdAt: 'desc' },
      { id: 'desc' },
    ];
    switch (sort) {
      case DocumentSort.SIZE:
        return [{ sizeBytes: order }, ...tieBreak];
      case DocumentSort.NAME:
        return [{ name: order }, ...tieBreak];
      case DocumentSort.CATEGORY:
        return [{ category: order }, ...tieBreak];
      case DocumentSort.STATUS:
        return [{ status: order }, ...tieBreak];
      default:
        return [{ createdAt: order }, { id: order }];
    }
  }

  private countsOf<K extends DocumentCategory | DocumentStatus>(
    keys: readonly K[],
    counted: [K, number][],
  ): Record<K, number> {
    const counts = Object.fromEntries(keys.map((key) => [key, 0])) as Record<K, number>;
    for (const [key, count] of counted) {
      counts[key] = count;
    }
    return counts;
  }
}
