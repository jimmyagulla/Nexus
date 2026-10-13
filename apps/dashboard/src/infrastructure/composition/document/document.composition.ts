import {
  createDocumentsPageComposition,
  type DocumentsPageComposition,
} from './documents-page.composition';
import {
  createDocumentUploadPageComposition,
  type DocumentUploadPageComposition,
} from './document-upload-page.composition';
import {
  createDocumentSentPageComposition,
  type DocumentSentPageComposition,
} from './document-sent-page.composition';

/** Compositions of the document pages. */
export type DocumentComposition = {
  documents: DocumentsPageComposition;
  documentUpload: DocumentUploadPageComposition;
  documentSent: DocumentSentPageComposition;
};

export function createDocumentComposition(): DocumentComposition {
  return {
    documents: createDocumentsPageComposition(),
    documentUpload: createDocumentUploadPageComposition(),
    documentSent: createDocumentSentPageComposition(),
  };
}
