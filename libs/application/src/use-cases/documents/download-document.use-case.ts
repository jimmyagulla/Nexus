import {
  ActorContext,
  DocumentFileLink,
  requireOwnedDocument,
} from '@hexagonal-monorepo-template/domain';
import {
  IDocumentFileStorage,
  IDocumentRepository,
  IDownloadDocument,
} from '@hexagonal-monorepo-template/ports';

export class DownloadDocumentUseCase implements IDownloadDocument {
  constructor(
    private readonly documents: IDocumentRepository,
    private readonly files: IDocumentFileStorage,
  ) {}

  async execute(input: {
    actor: ActorContext;
    documentId: string;
  }): Promise<DocumentFileLink> {
    const document = requireOwnedDocument(
      await this.documents.findById(input.documentId),
      input.actor,
    );
    return this.files.linkTo(document.storageKey, {
      downloadAs: document.downloadName,
    });
  }
}
