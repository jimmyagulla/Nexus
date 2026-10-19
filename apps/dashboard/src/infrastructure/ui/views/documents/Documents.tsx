import { DOCUMENT_SEARCH_MAX_LENGTH, DocumentSort } from '@hexagonal-monorepo-template/domain';
import { ActiveFilters } from '../../common/data/ActiveFilters';
import { EmptyTableRow } from '../../common/data/EmptyTableRow';
import { FilterButton } from '../../common/data/FilterButton';
import { FilterChip } from '../../common/data/FilterChip';
import { SearchField } from '../../common/data/SearchField';
import { PageContent } from '../../common/page/PageContent';
import { PageHeader } from '../../common/page/PageHeader';
import { i18n } from '../../i18n/i18n';
import { Button } from '../../shared/button';
import { Sheet, SheetTrigger } from '../../shared/sheet';
import { Table, TableHead, TableHeader } from '../../shared/table';
import { DocumentFiltersSheet } from './components/DocumentFiltersSheet';
import { DocumentRow } from './components/DocumentRow';
import { SortableHead } from './components/SortableHead';
import type { DocumentsListHandlers } from './components/documents-list.handlers';
import type { ActiveFilterModel } from '../../../../adapters/presenters/documents/document-active-filters.presenter';
import type { DocumentFiltersModel } from '../../../../adapters/presenters/documents/document-filters.presenter';
import type { DocumentListSummaryModel } from '../../../../adapters/presenters/documents/document-list-summary.presenter';
import type { DocumentRowModel } from '../../../../adapters/presenters/documents/document-row.presenter';
import type { DocumentSortModel } from '../../../../adapters/presenters/documents/document-sort.presenter';

interface DocumentsProps {
  summary: DocumentListSummaryModel;
  activeFilters: ActiveFilterModel[];
  filters: DocumentFiltersModel;
  sort: DocumentSortModel;
  rows: DocumentRowModel[];
  /** Text of the search box, as typed. */
  search: string;
  handlers: DocumentsListHandlers;
  onUpload: () => void;
}

const columns = 'minmax(0,1.7fr) minmax(0,1fr) 92px 92px 96px 130px 100px';

/** P2.1 — the employee's document vault. */
export function Documents({
  summary,
  activeFilters,
  filters,
  sort,
  rows,
  search,
  handlers,
  onUpload,
}: DocumentsProps) {
  const labels = i18n.messages.documents.list;
  const common = i18n.messages.common;
  const sortable = (column: DocumentSort) => ({
    model: sort[column],
    onSort: () => handlers.onCycleSort(column),
  });

  return (
    <PageContent>
      <PageHeader
        title={labels.title}
        description={
          <>
            <i aria-hidden className="ri-lock-2-line text-green-500" />
            {labels.privacy}
          </>
        }
        actions={
          <Button onClick={onUpload}>
            <i aria-hidden className="ri-upload-cloud-2-line text-18" />
            {labels.upload}
          </Button>
        }
      />
      <div className="flex items-center gap-2">
        <SearchField
          placeholder={labels.searchPlaceholder}
          value={search}
          maxLength={DOCUMENT_SEARCH_MAX_LENGTH}
          onValueChange={handlers.onSearchChange}
        />
        <Sheet>
          <SheetTrigger asChild>
            <FilterButton count={summary.appliedFilterCount} />
          </SheetTrigger>
          <DocumentFiltersSheet model={filters} handlers={handlers} />
        </Sheet>
      </div>
      <ActiveFilters
        summary={summary.resultSummary}
        canClear={summary.canClearFilters}
        onClear={handlers.onClearFilters}
      >
        {activeFilters.map((filter) => (
          <FilterChip
            key={filter.key}
            label={filter.label}
            value={filter.value}
            onRemove={() => handlers.onRemoveFilter(filter.key)}
          />
        ))}
      </ActiveFilters>
      <Table columns={columns}>
        <TableHeader>
          <SortableHead {...sortable(DocumentSort.NAME)}>{labels.columns.name}</SortableHead>
          <SortableHead {...sortable(DocumentSort.CATEGORY)}>{labels.columns.category}</SortableHead>
          <SortableHead {...sortable(DocumentSort.DATE)}>{labels.columns.date}</SortableHead>
          <SortableHead {...sortable(DocumentSort.SIZE)}>{labels.columns.size}</SortableHead>
          <TableHead>{labels.columns.emitter}</TableHead>
          <SortableHead {...sortable(DocumentSort.STATUS)}>{common.status}</SortableHead>
          <TableHead className="justify-end">{common.actions}</TableHead>
        </TableHeader>
        {rows.map((document) => (
          <DocumentRow
            key={document.id}
            model={document}
            onView={handlers.onView}
            onDownload={handlers.onDownload}
          />
        ))}
        {rows.length === 0 && <EmptyTableRow message={summary.emptyMessage} />}
      </Table>
    </PageContent>
  );
}
