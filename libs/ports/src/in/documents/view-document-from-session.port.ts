import { DocumentFileLink } from '@hexagonal-monorepo-template/domain';

export interface IViewDocumentFromSession {
  execute(documentId: string): Promise<DocumentFileLink>;
}

export const IViewDocumentFromSession = Symbol('IViewDocumentFromSession');
