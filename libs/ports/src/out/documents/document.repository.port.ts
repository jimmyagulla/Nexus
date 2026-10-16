import {
  Document,
  DocumentList,
  DocumentListCriteria,
  DocumentListScope,
  DocumentProps,
} from '@hexagonal-monorepo-template/domain';

/** A document about to be recorded: everything but its identifier. */
export type NewDocument = Omit<DocumentProps, 'id'>;

export interface IDocumentRepository {
  /** Records every document of a deposit, or none of them. */
  insertAll(documents: readonly NewDocument[]): Promise<Document[]>;
  save(document: Document): Promise<void>;
  findById(documentId: string): Promise<Document | null>;
  list(
    scope: DocumentListScope,
    criteria: DocumentListCriteria,
  ): Promise<DocumentList>;
}

export const IDocumentRepository = Symbol('IDocumentRepository');
