import { ExchangeDirection } from '../entities/exchange-direction';
import { ExchangeStatus } from '../entities/exchange-status';

export type ExchangeFilters = {
  category?: string | null;
  from?: string | null;
  to?: string | null;
  direction?: ExchangeDirection | null;
  status?: ExchangeStatus | null;
};

export function hasExchangeFilters(filters: ExchangeFilters): boolean {
  return Object.values(filters).some((value) => Boolean(value));
}
