import { useMutation } from '@tanstack/react-query';
import type { DocumentsPageComposition } from '../../../composition/document/documents-page.composition';
import { saveFile } from '../../lib/save-file';

/**
 * Saves a document on the device through the browser download manager. The
 * file is read first, so that the download always carries its own name.
 */
export function useDownloadDocument({ controller, files }: DocumentsPageComposition) {
  return useMutation({
    mutationFn: async (documentId: string) => {
      const link = await controller.downloadDocument(documentId);
      saveFile(await files.read(link.url, link.contentType), link.fileName);
    },
  });
}
