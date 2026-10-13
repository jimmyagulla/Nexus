import { FilterButton } from '../../../common/data/FilterButton';
import { SearchField } from '../../../common/data/SearchField';
import { SortButton } from '../../../common/data/SortButton';
import { i18n } from '../../../i18n/i18n';
import { Table, TableHead, TableHeader } from '../../../shared/table';
import { ExchangeRow } from './ExchangeRow';
import type { ExchangeRowModel } from '../../../../../adapters/presenters/accounting-firm/accounting-firm.presenter';

const columns = 'minmax(0, 1fr) 100px 190px 140px 80px';

/** Toolbar and table of the exchanges shown by one tab. */
export function ExchangesPanel({ exchanges }: { exchanges: ExchangeRowModel[] }) {
  const labels = i18n.messages.accountingFirm.exchanges;

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center gap-2">
        <SearchField placeholder={labels.searchPlaceholder} />
        <FilterButton className="border-primary" />
        <span className="flex-1" />
        <SortButton label={labels.sort} />
      </div>
      <Table columns={columns}>
        <TableHeader className="py-2.5">
          <TableHead>{labels.document}</TableHead>
          <TableHead>{labels.date}</TableHead>
          <TableHead>{labels.direction}</TableHead>
          <TableHead>{labels.status}</TableHead>
          <TableHead className="justify-end">{labels.actions}</TableHead>
        </TableHeader>
        {exchanges.map((exchange) => (
          <ExchangeRow key={exchange.id} exchange={exchange} />
        ))}
      </Table>
    </div>
  );
}
