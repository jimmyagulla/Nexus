import type { DocumentsComposition } from '../../../composition/documents.composition';
import { DocumentUpload } from './DocumentUpload';

interface DocumentUploadPageProps {
  deps: DocumentsComposition;
}

export function DocumentUploadPage({ deps }: DocumentUploadPageProps) {
  return <DocumentUpload model={deps.documentUploadPresenter.present()} />;
}
