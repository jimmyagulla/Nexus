import type { DocumentSentComposition } from '../../../composition/document-sent.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetDocumentSent } from '../../hooks/useGetDocumentSent';
import { i18n } from '../../i18n/i18n';
import { DocumentSent } from './DocumentSent';

interface DocumentSentPageProps {
  deps: DocumentSentComposition;
}

export function DocumentSentPage({ deps }: DocumentSentPageProps) {
  const documentSent = useGetDocumentSent(deps);

  if (documentSent.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (documentSent.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <DocumentSent model={documentSent.data} />;
}
