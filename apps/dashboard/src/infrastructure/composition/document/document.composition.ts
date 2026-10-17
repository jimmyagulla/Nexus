import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import {
  createDocumentsPageComposition,
  type DocumentsPageComposition,
} from './documents-page.composition';

/** Compositions of the document pages. The upload form opens over the list. */
export type DocumentComposition = {
  documents: DocumentsPageComposition;
};

export function createDocumentComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
): DocumentComposition {
  return {
    documents: createDocumentsPageComposition(httpClient, sessions),
  };
}
