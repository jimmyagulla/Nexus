import { loadApiConfig } from './load-api-config';

describe('loadApiConfig', () => {
  it('returns defaults when env is empty', () => {
    expect(loadApiConfig({})).toEqual({
      port: 3000,
      authAllowed: true,
      globalPrefix: 'api',
    });
  });

  it('parses PORT, AUTH_ALLOWED, and API_GLOBAL_PREFIX', () => {
    expect(
      loadApiConfig({
        PORT: '8080',
        AUTH_ALLOWED: 'false',
        API_GLOBAL_PREFIX: 'v1',
      }),
    ).toEqual({
      port: 8080,
      authAllowed: false,
      globalPrefix: 'v1',
    });
  });

  it('throws when PORT is invalid', () => {
    expect(() => loadApiConfig({ PORT: 'abc' })).toThrow('Invalid port: abc');
  });

  it('throws when AUTH_ALLOWED is invalid', () => {
    expect(() => loadApiConfig({ AUTH_ALLOWED: 'maybe' })).toThrow(
      'Invalid boolean: maybe',
    );
  });

  it('throws when API_GLOBAL_PREFIX is blank', () => {
    expect(() => loadApiConfig({ API_GLOBAL_PREFIX: '   ' })).toThrow(
      'Invalid API_GLOBAL_PREFIX: value is empty',
    );
  });
});
