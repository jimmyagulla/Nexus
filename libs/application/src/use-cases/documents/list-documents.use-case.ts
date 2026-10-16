import {
  ActorContext,
  DocumentList,
  DocumentListCriteria,
  requireDocumentOwnerScope,
} from '@hexagonal-monorepo-template/domain';
import {
  IDocumentRepository,
  IListDocuments,
} from '@hexagonal-monorepo-template/ports';

export class ListDocumentsUseCase implements IListDocuments {
  constructor(private readonly documents: IDocumentRepository) {}

  async execute(input: {
    actor: ActorContext;
    criteria: DocumentListCriteria;
  }): Promise<DocumentList> {
    return this.documents.list(
      requireDocumentOwnerScope(input.actor),
      input.criteria,
    );
  }
}
