import { DocumentFileLink } from '@hexagonal-monorepo-template/domain';

export interface IDownloadDocumentFromSession {
  execute(documentId: string): Promise<DocumentFileLink>;
}

export const IDownloadDocumentFromSession = Symbol(
  'IDownloadDocumentFromSession',
);
