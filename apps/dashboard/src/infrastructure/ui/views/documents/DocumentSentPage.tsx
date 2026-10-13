import type { DocumentsComposition } from '../../../composition/documents.composition';
import { DocumentSent } from './DocumentSent';

interface DocumentSentPageProps {
  deps: DocumentsComposition;
}

export function DocumentSentPage({ deps }: DocumentSentPageProps) {
  return <DocumentSent model={deps.documentSentPresenter.present()} />;
}
