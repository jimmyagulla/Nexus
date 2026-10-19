import {
  Document,
  DocumentDeposit,
  DocumentFileLink,
  DocumentList,
  DocumentListCriteria,
  DocumentStatus,
  DocumentSummary,
  documentFileFormatSpec,
  ErrorCode,
  toDocumentList,
  toDocumentSummary,
} from '@hexagonal-monorepo-template/domain';
import { toDataUrl } from '@hexagonal-monorepo-template/infrastructure';
import {
  IClock,
  IDocumentGateway,
  IIdGenerator,
} from '@hexagonal-monorepo-template/ports';

/** A document of the in-memory API, with its file. */
export type InMemoryApiDocument = {
  document: Document;
  content: Uint8Array;
};

/**
 * The documents of the API, kept in the process. A token stands for the
 * person it was issued to: their deposits are theirs, and they only reach
 * their own documents. A link is a `data:` URL carrying the file itself.
 */
export class InMemoryDocumentGateway implements IDocumentGateway {
  constructor(
    private readonly ids: IIdGenerator,
    private readonly clock: IClock,
    private readonly documents = new Map<string, InMemoryApiDocument>(),
  ) {}

  async list(
    companyId: string,
    criteria: DocumentListCriteria,
    token: string,
  ): Promise<DocumentList> {
    const owned = [...this.documents.values()]
      .map(({ document }) => document)
      .filter((document) => document.isOwnedBy(companyId, token));
    return toDocumentList(owned, criteria);
  }

  async deposit(
    companyId: string,
    deposit: DocumentDeposit,
    token: string,
  ): Promise<DocumentSummary[]> {
    const createdAt = this.clock.now();
    return deposit.files.map((file) => {
      const document = new Document({
        id: this.ids.next(),
        companyId,
        ownerId: token,
        uploadedById: token,
        name: file.name,
        category: deposit.category,
        status: DocumentStatus.PENDING,
        format: file.format,
        sizeBytes: file.sizeBytes,
        comment: deposit.comment,
        storageKey: `${companyId}/${token}/${file.fileName}`,
        createdAt,
      });
      this.documents.set(document.id, { document, content: file.content });
      return toDocumentSummary(document);
    });
  }

  async view(
    companyId: string,
    documentId: string,
    token: string,
  ): Promise<DocumentFileLink> {
    const stored = this.owned(companyId, documentId, token);
    const viewed = { ...stored, document: stored.document.view() };
    this.documents.set(documentId, viewed);
    return this.linkTo(viewed);
  }

  async download(
    companyId: string,
    documentId: string,
    token: string,
  ): Promise<DocumentFileLink> {
    return this.linkTo(this.owned(companyId, documentId, token));
  }

  /** A document of someone else is refused exactly like a missing one. */
  private owned(
    companyId: string,
    documentId: string,
    token: string,
  ): InMemoryApiDocument {
    const stored = this.documents.get(documentId);
    if (stored === undefined || !stored.document.isOwnedBy(companyId, token)) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return stored;
  }

  private linkTo({ document, content }: InMemoryApiDocument): DocumentFileLink {
    const contentType = documentFileFormatSpec(document.format).mimeType;
    return {
      url: toDataUrl(contentType, content),
      fileName: document.downloadName,
      contentType,
    };
  }
}
