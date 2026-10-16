import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import {
  createDocumentsPageComposition,
  type DocumentsPageComposition,
} from './documents-page.composition';
import {
  createDocumentSentPageComposition,
  type DocumentSentPageComposition,
} from './document-sent-page.composition';

/** Compositions of the document pages. The upload form opens over the list. */
export type DocumentComposition = {
  documents: DocumentsPageComposition;
  documentSent: DocumentSentPageComposition;
};

export function createDocumentComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
): DocumentComposition {
  return {
    documents: createDocumentsPageComposition(httpClient, sessions),
    documentSent: createDocumentSentPageComposition(),
  };
}
