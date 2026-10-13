import { describe, expect, it } from 'vitest';
import {
  ErrorCode,
  ExchangeDirection,
  ExchangeStatus,
} from '@hexagonal-monorepo-template/domain';
import {
  EMPTY_EXCHANGE_FILTERS_FORM,
  exchangeFiltersSchema,
} from './exchange-filters.schema';

describe('exchangeFiltersSchema', () => {
  it('turns an empty form into no filter at all', () => {
    expect(exchangeFiltersSchema.parse(EMPTY_EXCHANGE_FILTERS_FORM)).toEqual({
      category: null,
      from: null,
      to: null,
      direction: null,
      status: null,
    });
  });

  it('turns every chosen filter into its value', () => {
    expect(
      exchangeFiltersSchema.parse({
        category: '  Facture ',
        from: '2026-10-01',
        to: '2026-10-31',
        direction: ExchangeDirection.CABINET_TO_COMPANY,
        status: ExchangeStatus.RECEIVED,
      }),
    ).toEqual({
      category: 'Facture',
      from: '2026-10-01',
      to: '2026-10-31',
      direction: 'CABINET_TO_COMPANY',
      status: 'RECEIVED',
    });
  });

  it('refuses a date that is not a calendar date', () => {
    const result = exchangeFiltersSchema.safeParse({
      ...EMPTY_EXCHANGE_FILTERS_FORM,
      from: '06/10/2026',
    });

    expect(result.error?.issues[0]?.message).toBe(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('refuses a status that is not one of the exchanges', () => {
    expect(
      exchangeFiltersSchema.safeParse({
        ...EMPTY_EXCHANGE_FILTERS_FORM,
        status: 'ARCHIVED',
      }).success,
    ).toBe(false);
  });
});
