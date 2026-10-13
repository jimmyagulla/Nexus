import { hasExchangeFilters } from './exchange-filters';

describe('hasExchangeFilters', () => {
  it('knows when nothing is filtered', () => {
    expect(hasExchangeFilters({})).toBe(false);
    expect(
      hasExchangeFilters({
        category: null,
        from: '',
        to: undefined,
        direction: null,
        status: null,
      }),
    ).toBe(false);
  });

  it('knows when anything is filtered', () => {
    expect(hasExchangeFilters({ category: 'Facture' })).toBe(true);
    expect(hasExchangeFilters({ from: '2026-10-01' })).toBe(true);
    expect(hasExchangeFilters({ to: '2026-10-31' })).toBe(true);
    expect(hasExchangeFilters({ direction: 'CABINET_TO_COMPANY' })).toBe(true);
    expect(hasExchangeFilters({ status: 'RECEIVED' })).toBe(true);
  });
});
