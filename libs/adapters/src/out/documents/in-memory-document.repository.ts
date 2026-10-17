import {
  Document,
  DocumentList,
  DocumentListCriteria,
  OwnerScope,
  toDocumentList,
} from '@hexagonal-monorepo-template/domain';
import {
  IDocumentRepository,
  IIdGenerator,
  NewDocument,
} from '@hexagonal-monorepo-template/ports';

export class InMemoryDocumentRepository implements IDocumentRepository {
  constructor(
    private readonly ids: IIdGenerator,
    private readonly documents = new Map<string, Document>(),
  ) {}

  async insertAll(documents: readonly NewDocument[]): Promise<Document[]> {
    const inserted = documents.map(
      (document) => new Document({ ...document, id: this.ids.next() }),
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
    scope: OwnerScope,
    criteria: DocumentListCriteria,
  ): Promise<DocumentList> {
    const owned = [...this.documents.values()].filter((document) =>
      document.isOwnedBy(scope.companyId, scope.ownerId),
    );
    return toDocumentList(owned, criteria);
  }
}
