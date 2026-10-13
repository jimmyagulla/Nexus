import { useQuery } from '@tanstack/react-query';
import type { DocumentSentComposition } from '../../composition/document-sent.composition';
import { documentSentFixture } from '../fixtures/documents.fixture';

export const getDocumentSentQueryKey = () => ['document-sent'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetDocumentSent({ presenter }: DocumentSentComposition) {
  return useQuery({
    queryKey: getDocumentSentQueryKey(),
    queryFn: async () => presenter.present(documentSentFixture),
  });
}
