import { useQuery } from '@tanstack/react-query';
import type { DocumentUploadPageComposition } from '../../composition/document/document-upload-page.composition';
import { documentUploadFixture } from '../fixtures/documents.fixture';

export const getDocumentUploadQueryKey = () => ['document-upload'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetDocumentUpload({ presenter }: DocumentUploadPageComposition) {
  return useQuery({
    queryKey: getDocumentUploadQueryKey(),
    queryFn: async () => presenter.present(documentUploadFixture),
  });
}
