import { useQuery } from '@tanstack/react-query';
import type { DocumentsPageComposition } from '../../composition/document/documents-page.composition';
import { documentsFixture } from '../fixtures/documents.fixture';

export const getDocumentsQueryKey = () => ['documents'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetDocuments({ presenter }: DocumentsPageComposition) {
  return useQuery({
    queryKey: getDocumentsQueryKey(),
    queryFn: async () => presenter.present(documentsFixture),
  });
}
