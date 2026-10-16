import {
  ActorContext,
  DocumentFileLink,
} from '@hexagonal-monorepo-template/domain';

export interface IDownloadDocument {
  execute(input: {
    actor: ActorContext;
    documentId: string;
  }): Promise<DocumentFileLink>;
}

export const IDownloadDocument = Symbol('IDownloadDocument');
