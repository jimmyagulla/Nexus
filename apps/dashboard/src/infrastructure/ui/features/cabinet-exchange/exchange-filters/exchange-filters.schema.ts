import { z } from 'zod';
import {
  CALENDAR_DATE_PATTERN,
  ErrorCode,
  ExchangeDirection,
  ExchangeFilters,
  ExchangeStatus,
} from '@hexagonal-monorepo-template/domain';

const date = z.union([
  z.literal(''),
  z.string().regex(CALENDAR_DATE_PATTERN, ErrorCode.REQUIRED_INFORMATION),
]);

export const exchangeFiltersSchema = z
  .object({
    category: z.string().trim(),
    from: date,
    to: date,
    direction: z.union([
      z.literal(''),
      z.enum(Object.values(ExchangeDirection) as [string, ...string[]]),
    ]),
    status: z.union([
      z.literal(''),
      z.enum(Object.values(ExchangeStatus) as [string, ...string[]]),
    ]),
  })
  .transform(
    (values): ExchangeFilters => ({
      category: values.category || null,
      from: values.from || null,
      to: values.to || null,
      direction: (values.direction || null) as ExchangeFilters['direction'],
      status: (values.status || null) as ExchangeFilters['status'],
    }),
  );

export type ExchangeFiltersFormValues = z.input<typeof exchangeFiltersSchema>;

export const EMPTY_EXCHANGE_FILTERS_FORM: ExchangeFiltersFormValues = {
  category: '',
  from: '',
  to: '',
  direction: '',
  status: '',
};
