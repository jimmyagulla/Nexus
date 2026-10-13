import { Link } from '@tanstack/react-router';
import { ActiveFilters } from '../../common/data/ActiveFilters';
import { FilterButton } from '../../common/data/FilterButton';
import { FilterChip } from '../../common/data/FilterChip';
import { SearchField } from '../../common/data/SearchField';
import { SortButton } from '../../common/data/SortButton';
import { PageContent } from '../../common/page/PageContent';
import { PageHeader } from '../../common/page/PageHeader';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Button } from '../../shared/button';
import { Sheet, SheetTrigger } from '../../shared/sheet';
import { Table, TableHead, TableHeader } from '../../shared/table';
import { DocumentFiltersSheet } from './components/DocumentFiltersSheet';
import { DocumentRow } from './components/DocumentRow';
import type { DocumentsViewModel } from '../../../../adapters/presenters/documents/documents.view-models';

interface DocumentsProps {
  model: DocumentsViewModel;
}

const columns = 'minmax(0,1.7fr) minmax(0,1fr) 92px 92px 96px 130px 100px';

/** P2.1 — the employee's document vault. */
export function Documents({ model }: DocumentsProps) {
  const labels = i18n.messages.documents.list;
  const common = i18n.messages.common;

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
          <Button asChild>
            <Link to={AppRoutes.documentUpload}>
              <i aria-hidden className="ri-upload-cloud-2-line text-18" />
              {labels.upload}
            </Link>
          </Button>
        }
      />
      <div className="flex items-center gap-2">
        <SearchField placeholder={labels.searchPlaceholder} />
        <Sheet>
          <SheetTrigger asChild>
            <FilterButton count={model.appliedFilterCount} />
          </SheetTrigger>
          <DocumentFiltersSheet model={model.filters} />
        </Sheet>
        <span className="flex-1" />
        <SortButton label={labels.sortLabel} />
      </div>
      <ActiveFilters summary={model.resultSummary}>
        {model.activeFilters.map((filter) => (
          <FilterChip key={filter.label} label={filter.label} value={filter.value} />
        ))}
      </ActiveFilters>
      <Table columns={columns}>
        <TableHeader>
          <TableHead>{labels.columns.name}</TableHead>
          <TableHead>{labels.columns.category}</TableHead>
          <TableHead>
            {labels.columns.date}
            <i aria-hidden className="ri-arrow-down-s-line text-heading" />
          </TableHead>
          <TableHead>{labels.columns.size}</TableHead>
          <TableHead>{labels.columns.emitter}</TableHead>
          <TableHead>{common.status}</TableHead>
          <TableHead className="justify-end">{common.actions}</TableHead>
        </TableHeader>
        {model.documents.map((document) => (
          <DocumentRow key={document.id} model={document} />
        ))}
      </Table>
    </PageContent>
  );
}
