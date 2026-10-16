import {
  type MutateOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import type { DocumentsPageComposition } from '../../composition/document/documents-page.composition';
import { getDocumentsQueryKey } from './useGetDocuments';

/**
 * Opens a document in a new tab. The tab is opened during the click, before
 * the link is known, so that no popup blocker stops it; it then follows the
 * signed link, or closes if the document cannot be opened.
 */
export function useViewDocument({ controller }: DocumentsPageComposition) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ documentId, tab }: { documentId: string; tab: Window | null }) => {
      try {
        const url = await controller.viewDocument(documentId);
        if (tab === null) {
          window.open(url, '_blank', 'noopener');
        } else {
          tab.location.href = url;
        }
      } catch (error) {
        tab?.close();
        throw error;
      }
    },
    // Viewing marks the document as seen.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getDocumentsQueryKey() }),
  });

  return {
    ...mutation,
    view: (
      documentId: string,
      options?: MutateOptions<void, Error, { documentId: string; tab: Window | null }>,
    ) => {
      const tab = window.open('', '_blank');
      if (tab !== null) {
        tab.opener = null;
      }
      mutation.mutate({ documentId, tab }, options);
    },
  };
}
