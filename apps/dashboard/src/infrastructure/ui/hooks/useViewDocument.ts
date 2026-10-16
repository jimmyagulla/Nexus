import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { DocumentsPageComposition } from '../../composition/document/documents-page.composition';
import { fetchFile } from '../../network/document-files';
import { getDocumentsQueryKey } from './useGetDocuments';

/** A document read for the in-app viewer. */
export interface DocumentPreview {
  /** Local URL of the file; revoke it once the viewer closes. */
  objectUrl: string;
  fileName: string;
  contentType: string;
  /** Content of a text file (CSV), null otherwise. */
  text: string | null;
}

/** Reads a document for the in-app viewer; viewing marks it as seen. */
export function useViewDocument({ controller }: DocumentsPageComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string): Promise<DocumentPreview> => {
      const link = await controller.viewDocument(documentId);
      const file = await fetchFile(link.url, link.contentType);
      return {
        objectUrl: URL.createObjectURL(file),
        fileName: link.fileName,
        contentType: link.contentType,
        text: link.contentType.startsWith('text/') ? await file.text() : null,
      };
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getDocumentsQueryKey() }),
  });
}
