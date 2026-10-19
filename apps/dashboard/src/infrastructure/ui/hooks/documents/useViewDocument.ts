import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { DocumentsPageComposition } from '../../../composition/document/documents-page.composition';
import { previewOf, type FilePreview } from '../../lib/file-preview';
import { getDocumentsQueryKey } from './useGetDocuments';

/** Reads a document for the in-app viewer; viewing marks it as seen. */
export function useViewDocument({ controller, files }: DocumentsPageComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string): Promise<FilePreview> => {
      const link = await controller.viewDocument(documentId);
      return previewOf(await files.read(link.url, link.contentType), link);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getDocumentsQueryKey() }),
  });
}
