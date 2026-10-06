import { createSupabaseAdmin } from './create-supabase-admin';

type ClientRequest = { url: string; key: string; options: unknown };

const config = {
  url: 'https://project.test',
  serviceRoleKey: 'service-role-key',
};

const sdk = vi.hoisted(() => {
  const clientRequests: ClientRequest[] = [];
  const clients: unknown[] = [];

  return {
    clientRequests,
    clients,
    reset(): void {
      clientRequests.length = 0;
      clients.length = 0;
    },
    createClient(url: string, key: string, options?: unknown): unknown {
      clientRequests.push({ url, key, options });
      const client = { adminClientOf: url };
      clients.push(client);
      return client;
    },
  };
});

vi.mock('@supabase/supabase-js', () => ({ createClient: sdk.createClient }));

afterEach(() => {
  sdk.reset();
  vi.unstubAllEnvs();
});

describe('createSupabaseAdmin', () => {
  it('builds the client on the configured project url and service role key', () => {
    createSupabaseAdmin(config);

    expect(
      sdk.clientRequests.map(({ url, key }) => ({ url, key })),
    ).toEqual([{ url: 'https://project.test', key: 'service-role-key' }]);
  });

  it('disables session persistence and automatic token refresh', () => {
    createSupabaseAdmin(config);

    expect(sdk.clientRequests[0].options).toEqual({
      auth: { persistSession: false, autoRefreshToken: false },
    });
  });

  it('hands back the client built by the SDK', () => {
    expect(createSupabaseAdmin(config)).toBe(sdk.clients[0]);
  });

  it('builds the client from the configuration, never from the environment', () => {
    vi.stubEnv('SUPABASE_URL', 'https://decoy.test');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'decoy-key');

    createSupabaseAdmin(config);

    expect(
      sdk.clientRequests.map(({ url, key }) => ({ url, key })),
    ).toEqual([{ url: 'https://project.test', key: 'service-role-key' }]);
  });

  it('builds an independent client on each call', () => {
    expect(createSupabaseAdmin(config)).not.toBe(createSupabaseAdmin(config));
  });
});
