import {
  ActorContext,
  DocumentList,
  DocumentListCriteria,
  requireOwnerScope,
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
      requireOwnerScope(input.actor),
      input.criteria,
    );
  }
}
