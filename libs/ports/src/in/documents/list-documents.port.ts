import {
  ActorContext,
  DocumentList,
  DocumentListCriteria,
} from '@hexagonal-monorepo-template/domain';

export interface IListDocuments {
  execute(input: {
    actor: ActorContext;
    criteria: DocumentListCriteria;
  }): Promise<DocumentList>;
}

export const IListDocuments = Symbol('IListDocuments');
