import type { DocumentsComposition } from '../../../composition/documents.composition';
import { Documents } from './Documents';

interface DocumentsPageProps {
  deps: DocumentsComposition;
}

export function DocumentsPage({ deps }: DocumentsPageProps) {
  return <Documents model={deps.documentsPresenter.present()} />;
}
