import { ActiveFilters } from '../../common/data/ActiveFilters';
import { FilterButton } from '../../common/data/FilterButton';
import { FilterChip } from '../../common/data/FilterChip';
import { SearchField } from '../../common/data/SearchField';
import { SortButton } from '../../common/data/SortButton';
import { PageContent } from '../../common/page/PageContent';
import { PageHeader } from '../../common/page/PageHeader';
import { i18n } from '../../i18n/i18n';
import { Button } from '../../shared/button';
import { Table, TableHead, TableHeader } from '../../shared/table';
import { EmployeeRow, type EmployeeRowModel } from './components/EmployeeRow';

export interface EmployeesViewModel {
  summary: string;
  resultsSummary: string;
  serviceFilter: string;
  employees: EmployeeRowModel[];
}

const columns =
  'minmax(0, 1.4fr) minmax(0, 1fr) 96px 120px 92px 124px 112px';

/** P8.2 — employees list of the employer. */
export function Employees({ model }: { model: EmployeesViewModel }) {
  const labels = i18n.messages.employees.list;

  return (
    <PageContent className="md:px-8 md:py-7">
      <PageHeader
        title={labels.title}
        description={model.summary}
        actions={
          <Button>
            <i aria-hidden className="ri-user-add-line" />
            {labels.addEmployee}
          </Button>
        }
      />

      <div className="flex items-center gap-2">
        <SearchField placeholder={labels.searchPlaceholder} />
        <FilterButton count={1} className="border border-primary bg-card" />
        <span className="flex-1" />
        <SortButton label={labels.sort} />
      </div>

      <ActiveFilters summary={model.resultsSummary}>
        <FilterChip label={labels.serviceFilter} value={model.serviceFilter} />
      </ActiveFilters>

      <Table columns={columns}>
        <TableHeader>
          <TableHead>
            {labels.name}
            <i aria-hidden className="ri-arrow-up-s-line text-heading" />
          </TableHead>
          <TableHead>{labels.position}</TableHead>
          <TableHead>{labels.service}</TableHead>
          <TableHead>{labels.status}</TableHead>
          <TableHead>{labels.startDate}</TableHead>
          <TableHead>{labels.lastActivity}</TableHead>
          <TableHead />
        </TableHeader>
        {model.employees.map((employee) => (
          <EmployeeRow key={employee.id} employee={employee} />
        ))}
      </Table>
    </PageContent>
  );
}
