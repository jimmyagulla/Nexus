import {
  compareDocuments,
  DOCUMENT_CATEGORIES,
  DOCUMENT_STATUSES,
  Document,
  DocumentCategory,
  DocumentList,
  DocumentListCriteria,
  DocumentListScope,
  DocumentStatus,
  matchesDocumentListCriteria,
  toDocumentSummary,
} from '@hexagonal-monorepo-template/domain';
import {
  IDocumentRepository,
  NewDocument,
} from '@hexagonal-monorepo-template/ports';

export class InMemoryDocumentRepository implements IDocumentRepository {
  constructor(private readonly documents = new Map<string, Document>()) {}

  async insertAll(documents: readonly NewDocument[]): Promise<Document[]> {
    const inserted = documents.map(
      (document) =>
        new Document({ ...document, id: globalThis.crypto.randomUUID() }),
    );
    for (const document of inserted) {
      this.documents.set(document.id, document);
    }
    return inserted;
  }

  async save(document: Document): Promise<void> {
    this.documents.set(document.id, document);
  }

  async findById(documentId: string): Promise<Document | null> {
    return this.documents.get(documentId) ?? null;
  }

  async list(
    scope: DocumentListScope,
    criteria: DocumentListCriteria,
  ): Promise<DocumentList> {
    const owned = this.ownedBy(scope);
    return {
      items: owned
        .filter((document) => matchesDocumentListCriteria(document, criteria))
        .sort(compareDocuments(criteria.sort, criteria.direction))
        .map(toDocumentSummary),
      total: owned.length,
      categoryCounts: this.countCategories(owned),
      statusCounts: this.countStatuses(owned),
    };
  }

  private ownedBy(scope: DocumentListScope): Document[] {
    return [...this.documents.values()].filter((document) =>
      document.isOwnedBy(scope.companyId, scope.ownerId),
    );
  }

  private countCategories(
    documents: readonly Document[],
  ): Record<DocumentCategory, number> {
    return Object.fromEntries(
      DOCUMENT_CATEGORIES.map((category) => [
        category,
        documents.filter((document) => document.category === category).length,
      ]),
    ) as Record<DocumentCategory, number>;
  }

  private countStatuses(
    documents: readonly Document[],
  ): Record<DocumentStatus, number> {
    return Object.fromEntries(
      DOCUMENT_STATUSES.map((status) => [
        status,
        documents.filter((document) => document.status === status).length,
      ]),
    ) as Record<DocumentStatus, number>;
  }
}
