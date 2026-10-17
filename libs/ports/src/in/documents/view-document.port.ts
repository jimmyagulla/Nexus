import {
  ActorContext,
  DocumentFileLink,
} from '@hexagonal-monorepo-template/domain';

export interface IViewDocument {
  execute(input: {
    actor: ActorContext;
    documentId: string;
  }): Promise<DocumentFileLink>;
}

export const IViewDocument = Symbol('IViewDocument');
