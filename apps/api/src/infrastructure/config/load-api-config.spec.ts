import { loadApiConfig } from './load-api-config';

describe('loadApiConfig', () => {
  it('returns memory persistence by default', () => {
    expect(loadApiConfig({})).toEqual({
      port: 3000,
      globalPrefix: 'api',
      persistence: 'memory',
      databaseUrl: undefined,
      directUrl: undefined,
      supabaseUrl: undefined,
      supabaseJwksUrl: undefined,
      supabaseServiceRoleKey: undefined,
      authDisabled: false,
    });
  });

  it('parses PORT, prefix, persistence and supabase urls', () => {
    expect(
      loadApiConfig({
        PORT: '8080',
        API_GLOBAL_PREFIX: 'v1',
        PERSISTENCE: 'postgres',
        DATABASE_URL: 'postgres://db',
        DIRECT_URL: 'postgres://direct',
        SUPABASE_URL: 'https://example.supabase.co',
        SUPABASE_JWKS_URL: 'https://example.supabase.co/auth/v1/.well-known/jwks.json',
        SUPABASE_SERVICE_ROLE_KEY: 'service',
      }),
    ).toEqual({
      port: 8080,
      globalPrefix: 'v1',
      persistence: 'postgres',
      databaseUrl: 'postgres://db',
      directUrl: 'postgres://direct',
      supabaseUrl: 'https://example.supabase.co',
      supabaseJwksUrl:
        'https://example.supabase.co/auth/v1/.well-known/jwks.json',
      supabaseServiceRoleKey: 'service',
      authDisabled: false,
    });
  });

  it('throws when PORT is invalid', () => {
    expect(() => loadApiConfig({ PORT: 'abc' })).toThrow('Invalid port: abc');
  });

  it('throws when postgres persistence has no DATABASE_URL', () => {
    expect(() => loadApiConfig({ PERSISTENCE: 'postgres' })).toThrow(
      'Invalid DATABASE_URL: value is empty',
    );
  });

  it('throws when API_GLOBAL_PREFIX is blank', () => {
    expect(() => loadApiConfig({ API_GLOBAL_PREFIX: '   ' })).toThrow(
      'Invalid API_GLOBAL_PREFIX: value is empty',
    );
  });

  it('keeps authentication enabled by default', () => {
    expect(loadApiConfig({}).authDisabled).toBe(false);
  });

  it('disables authentication only when AUTH_DISABLED is true', () => {
    expect(loadApiConfig({ AUTH_DISABLED: 'true' }).authDisabled).toBe(true);
    expect(loadApiConfig({ AUTH_DISABLED: 'false' }).authDisabled).toBe(false);
    expect(loadApiConfig({ AUTH_DISABLED: '   ' }).authDisabled).toBe(false);
  });
});
