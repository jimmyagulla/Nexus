import type { DocumentUploadComposition } from '../../../composition/document-upload.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetDocumentUpload } from '../../hooks/useGetDocumentUpload';
import { i18n } from '../../i18n/i18n';
import { DocumentUpload } from './DocumentUpload';

interface DocumentUploadPageProps {
  deps: DocumentUploadComposition;
}

export function DocumentUploadPage({ deps }: DocumentUploadPageProps) {
  const documentUpload = useGetDocumentUpload(deps);

  if (documentUpload.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (documentUpload.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <DocumentUpload model={documentUpload.data} />;
}
