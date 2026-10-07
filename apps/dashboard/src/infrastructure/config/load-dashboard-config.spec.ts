import { describe, expect, it } from 'vitest';
import { loadDashboardConfig } from './load-dashboard-config';

describe('loadDashboardConfig', () => {
  it('reads the api url and the supabase browser keys', () => {
    expect(
      loadDashboardConfig({
        VITE_API_URL: 'https://api.nexus.test/api',
        VITE_SUPABASE_URL: 'https://project.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'anon',
      }),
    ).toEqual({
      apiUrl: 'https://api.nexus.test/api',
      supabaseUrl: 'https://project.supabase.co',
      supabaseAnonKey: 'anon',
      authDisabled: false,
    });
  });

  it('falls back to the local api when the variable is missing', () => {
    expect(loadDashboardConfig({}).apiUrl).toBe('http://localhost:3000/api');
  });

  it('falls back to the local api when the variable is blank', () => {
    expect(loadDashboardConfig({ VITE_API_URL: '   ' }).apiUrl).toBe(
      'http://localhost:3000/api',
    );
  });

  it('keeps authentication enabled by default', () => {
    expect(loadDashboardConfig({}).authDisabled).toBe(false);
  });

  it('disables authentication only when VITE_AUTH_DISABLED is true', () => {
    expect(
      loadDashboardConfig({ VITE_AUTH_DISABLED: 'true' }).authDisabled,
    ).toBe(true);
    expect(
      loadDashboardConfig({ VITE_AUTH_DISABLED: 'false' }).authDisabled,
    ).toBe(false);
  });

  it('leaves the supabase keys empty when they are missing', () => {
    expect(loadDashboardConfig({})).toMatchObject({
      supabaseUrl: '',
      supabaseAnonKey: '',
    });
  });
});
