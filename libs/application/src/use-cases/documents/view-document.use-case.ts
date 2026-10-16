import {
  ActorContext,
  Document,
  DocumentFileLink,
  documentFileFormatSpec,
  requireOwnedDocument,
} from '@hexagonal-monorepo-template/domain';
import {
  IDocumentFileStorage,
  IDocumentRepository,
  IViewDocument,
} from '@hexagonal-monorepo-template/ports';

export class ViewDocumentUseCase implements IViewDocument {
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
    await this.markAsSeen(document);
    return {
      url: await this.files.linkTo(document.storageKey, { downloadAs: null }),
      fileName: document.downloadName,
      contentType: documentFileFormatSpec(document.format).mimeType,
    };
  }

  private async markAsSeen(document: Document): Promise<void> {
    const viewed = document.view();
    if (viewed !== document) {
      await this.documents.save(viewed);
    }
  }
}
