import { useMutation } from '@tanstack/react-query';
import type { DocumentsPageComposition } from '../../composition/document/documents-page.composition';

/**
 * Saves a document on the device. The signed link answers with an
 * attachment, so following it downloads the file without leaving the page.
 */
export function useDownloadDocument({ controller }: DocumentsPageComposition) {
  return useMutation({
    mutationFn: async (documentId: string) => {
      const link = document.createElement('a');
      link.href = await controller.downloadDocument(documentId);
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
}
