import {
  ActorContext,
  DocumentDepositRequest,
  DocumentSummary,
} from '@hexagonal-monorepo-template/domain';

export interface IDepositDocuments {
  execute(input: {
    actor: ActorContext;
    request: DocumentDepositRequest;
  }): Promise<DocumentSummary[]>;
}

export const IDepositDocuments = Symbol('IDepositDocuments');
