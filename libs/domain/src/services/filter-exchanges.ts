import { CabinetExchange } from '../entities/cabinet-exchange';
import { CalendarDate } from '../value-objects/calendar-date';
import { ExchangeFilters } from './exchange-filters';

export function filterExchanges(
  exchanges: readonly CabinetExchange[],
  filters: ExchangeFilters,
): CabinetExchange[] {
  const from = parseBound(filters.from);
  const to = parseBound(filters.to);
  const category = filters.category?.trim().toLowerCase() ?? '';

  return exchanges.filter((exchange) => {
    const day = exchange.date().toISOString().slice(0, 10);
    return (
      (category === '' ||
        exchange.category?.value.toLowerCase() === category) &&
      (from === null || day >= from) &&
      (to === null || day <= to) &&
      (!filters.direction || exchange.direction === filters.direction) &&
      (!filters.status || exchange.status === filters.status)
    );
  });
}

function parseBound(raw: string | null | undefined): string | null {
  return raw === undefined || raw === null || raw === ''
    ? null
    : CalendarDate.parse(raw).value;
}
