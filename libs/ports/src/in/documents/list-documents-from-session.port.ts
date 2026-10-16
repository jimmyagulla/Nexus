import {
  DocumentList,
  DocumentListCriteria,
} from '@hexagonal-monorepo-template/domain';

export interface IListDocumentsFromSession {
  execute(criteria: DocumentListCriteria): Promise<DocumentList>;
}

export const IListDocumentsFromSession = Symbol('IListDocumentsFromSession');
