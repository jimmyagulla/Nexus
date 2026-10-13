import type { DocumentsComposition } from '../../../composition/documents.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetDocuments } from '../../hooks/useGetDocuments';
import { i18n } from '../../i18n/i18n';
import { Documents } from './Documents';

interface DocumentsPageProps {
  deps: DocumentsComposition;
}

export function DocumentsPage({ deps }: DocumentsPageProps) {
  const documents = useGetDocuments(deps);

  if (documents.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (documents.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <Documents model={documents.data} />;
}
