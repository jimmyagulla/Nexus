import { documentUploadFixture } from '../../fixtures/documents.fixture';
import { DocumentUpload } from './DocumentUpload';

/** Placeholder data until the documents presenter is wired. */
export function DocumentUploadPage() {
  return <DocumentUpload model={documentUploadFixture} />;
}
