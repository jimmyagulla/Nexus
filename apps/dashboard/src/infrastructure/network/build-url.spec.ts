import { describe, expect, it } from 'vitest';
import { buildUrl } from './build-url';

describe('buildUrl', () => {
  it('returns the base when there is no query', () => {
    expect(buildUrl('/companies', {})).toBe('/companies');
  });

  it('appends the present parameters', () => {
    expect(
      buildUrl('/companies', { page: 2, active: true, name: 'Acme' }),
    ).toBe('/companies?page=2&active=true&name=Acme');
  });

  it('keeps a zero and a false value', () => {
    expect(buildUrl('/companies', { page: 0, active: false })).toBe(
      '/companies?page=0&active=false',
    );
  });

  it('drops undefined and null parameters', () => {
    expect(
      buildUrl('/companies', { page: undefined, name: null, active: true }),
    ).toBe('/companies?active=true');
  });

  it('returns the base when every parameter is empty', () => {
    expect(buildUrl('/companies', { page: undefined, name: null })).toBe(
      '/companies',
    );
  });

  it('repeats a list parameter once per value and leaves an empty list out', () => {
    expect(buildUrl('/reports', { projects: ['Salon, Bordeaux', 'Valette'], tags: [] })).toBe(
      '/reports?projects=Salon%2C+Bordeaux&projects=Valette',
    );
  });
});
