import { useMutation } from '@tanstack/react-query';
import type { DocumentsPageComposition } from '../../composition/document/documents-page.composition';
import { fetchFile, saveFile } from '../../network/document-files';

/**
 * Saves a document on the device through the browser download manager. The
 * file is read first, so that the download always carries its own name.
 */
export function useDownloadDocument({ controller }: DocumentsPageComposition) {
  return useMutation({
    mutationFn: async (documentId: string) => {
      const link = await controller.downloadDocument(documentId);
      saveFile(await fetchFile(link.url, link.contentType), link.fileName);
    },
  });
}
