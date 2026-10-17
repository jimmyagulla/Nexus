import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { DocumentListCriteria } from '@hexagonal-monorepo-template/domain';
import type { DocumentsListState } from '../../../../adapters/controllers/documents.controller';
import type { ActiveFilterModel } from '../../../../adapters/presenters/documents/document-active-filters.presenter';
import type { DocumentFiltersModel } from '../../../../adapters/presenters/documents/document-filters.presenter';
import type { DocumentListSummaryModel } from '../../../../adapters/presenters/documents/document-list-summary.presenter';
import type { DocumentRowModel } from '../../../../adapters/presenters/documents/document-row.presenter';
import type { DocumentSortModel } from '../../../../adapters/presenters/documents/document-sort.presenter';
import type { DocumentsPageComposition } from '../../../composition/document/documents-page.composition';

/** What the documents list shows: the output of each of its presenters. */
export interface DocumentsListModels {
  summary: DocumentListSummaryModel;
  activeFilters: ActiveFilterModel[];
  filters: DocumentFiltersModel;
  sort: DocumentSortModel;
  rows: DocumentRowModel[];
}

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
  { controller, listPresenters }: DocumentsPageComposition,
  state: DocumentsListState,
) {
  const criteria = controller.criteriaFor(state);

  return useQuery({
    queryKey: getDocumentsQueryKey(criteria),
    queryFn: () => controller.listDocuments(criteria),
    select: (list): DocumentsListModels => ({
      summary: listPresenters.summary.present(list, criteria),
      activeFilters: listPresenters.activeFilters.present(criteria),
      filters: listPresenters.filters.present(list, state, criteria),
      sort: listPresenters.sort.present(state),
      rows: list.items.map((item) => listPresenters.row.present(item)),
    }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
