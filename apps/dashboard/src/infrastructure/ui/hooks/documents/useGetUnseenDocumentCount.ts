import { useQuery } from '@tanstack/react-query';
import { useStore } from 'zustand';
import { countUnseen } from '@hexagonal-monorepo-template/domain';
import { EVERY_DOCUMENT } from '../../../../adapters/controllers/documents.controller';
import type { DocumentsPageComposition } from '../../../composition/document/documents-page.composition';
import { getDocumentsQueryKey } from './useGetDocuments';

/**
 * How many documents the person has neither opened nor downloaded on this
 * device; it drops as soon as one is, without asking the API again. Reads the
 * cache entry of the documents screen as it opens.
 */
export function useGetUnseenDocumentCount({
  controller,
  seenDocuments,
}: Pick<DocumentsPageComposition, 'controller' | 'seenDocuments'>) {
  const seenIds = useStore(seenDocuments, (state) => state.seenIds);
  const criteria = controller.criteriaFor(EVERY_DOCUMENT);

  return useQuery({
    queryKey: getDocumentsQueryKey(criteria),
    queryFn: () => controller.listDocuments(criteria),
    select: (list) => countUnseen(list.items, seenIds),
    staleTime: 30_000,
  });
}
