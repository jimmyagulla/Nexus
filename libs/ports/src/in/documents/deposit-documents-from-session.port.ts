import {
  DocumentDepositRequest,
  DocumentSummary,
} from '@hexagonal-monorepo-template/domain';

export interface IDepositDocumentsFromSession {
  execute(request: DocumentDepositRequest): Promise<DocumentSummary[]>;
}

export const IDepositDocumentsFromSession = Symbol(
  'IDepositDocumentsFromSession',
);
