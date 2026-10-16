import { DOCUMENT_SEARCH_MAX_LENGTH, DocumentSort } from '@hexagonal-monorepo-template/domain';
import { ActiveFilters } from '../../common/data/ActiveFilters';
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
import { DocumentsEmptyRow } from './components/DocumentsEmptyRow';
import { SortableHead } from './components/SortableHead';
import type { DocumentsListHandlers } from './components/documents-list.handlers';
import type { DocumentsViewModel } from '../../../../adapters/presenters/documents/documents.presenter';

interface DocumentsProps {
  model: DocumentsViewModel;
  /** Text of the search box, as typed. */
  search: string;
  handlers: DocumentsListHandlers;
  onUpload: () => void;
}

const columns = 'minmax(0,1.7fr) minmax(0,1fr) 92px 92px 96px 130px 100px';

/** P2.1 — the employee's document vault. */
export function Documents({ model, search, handlers, onUpload }: DocumentsProps) {
  const labels = i18n.messages.documents.list;
  const common = i18n.messages.common;
  const sortable = (sort: DocumentSort) => ({
    model: model.sort[sort],
    onSort: () => handlers.onCycleSort(sort),
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
            <FilterButton count={model.appliedFilterCount} />
          </SheetTrigger>
          <DocumentFiltersSheet model={model.filters} handlers={handlers} />
        </Sheet>
      </div>
      <ActiveFilters
        summary={model.resultSummary}
        canClear={model.canClearFilters}
        onClear={handlers.onClearFilters}
      >
        {model.activeFilters.map((filter) => (
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
        {model.documents.map((document) => (
          <DocumentRow
            key={document.id}
            model={document}
            onView={handlers.onView}
            onDownload={handlers.onDownload}
          />
        ))}
        {model.documents.length === 0 && <DocumentsEmptyRow message={model.emptyMessage} />}
      </Table>
    </PageContent>
  );
}
