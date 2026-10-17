import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { DocumentListCriteria } from '@hexagonal-monorepo-template/domain';
import type { DocumentsListState } from '../../../../adapters/controllers/documents.controller';
import type { DocumentsPageComposition } from '../../../composition/document/documents-page.composition';

/**
 * Without criteria: every documents list, whatever its search, filters and
 * ordering (prefix used to invalidate them all).
 */
export const getDocumentsQueryKey = (criteria?: DocumentListCriteria) =>
  criteria === undefined ? ['documents'] : ['documents', 'list', criteria];

/**
 * One cache entry per search, filters and ordering. While a new combination
 * loads, the previous list stays on screen instead of a loading state.
 */
export function useGetDocuments(
  { controller, presenter }: DocumentsPageComposition,
  state: DocumentsListState,
) {
  const criteria = controller.criteriaFor(state);

  return useQuery({
    queryKey: getDocumentsQueryKey(criteria),
    queryFn: () => controller.listDocuments(criteria),
    select: (list) => presenter.present(list, state, criteria),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
