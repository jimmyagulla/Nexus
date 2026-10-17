import {
  DocumentDeposit,
  DocumentFileLink,
  DocumentList,
  DocumentListCriteria,
  DocumentSummary,
} from '@hexagonal-monorepo-template/domain';

export interface IDocumentGateway {
  list(
    companyId: string,
    criteria: DocumentListCriteria,
    token: string,
  ): Promise<DocumentList>;
  deposit(
    companyId: string,
    deposit: DocumentDeposit,
    token: string,
  ): Promise<DocumentSummary[]>;
  view(companyId: string, documentId: string, token: string): Promise<DocumentFileLink>;
  download(companyId: string, documentId: string, token: string): Promise<DocumentFileLink>;
}

export const IDocumentGateway = Symbol('IDocumentGateway');
