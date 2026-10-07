import { SupabaseSessionClient } from './supabase-session-client';

type SdkSession = {
  access_token: string;
  user: { id: string; app_metadata: Readonly<Record<string, unknown>> };
};

type ClientRequest = { url: string; key: string; options: unknown };

const config = { url: 'https://project.test', anonKey: 'anon-key' };

const sdk = vi.hoisted(() => {
  const state = {
    clientRequests: [] as ClientRequest[],
    session: null as SdkSession | null | undefined,
    renewed: null as SdkSession | null,
    readFailure: null as Error | null,
    refreshFailure: null as Error | null,
    refreshRefusal: null as Error | null,
  };

  return {
    state,
    reset(): void {
      state.clientRequests.length = 0;
      state.session = null;
      state.renewed = null;
      state.readFailure = null;
      state.refreshFailure = null;
      state.refreshRefusal = null;
    },
    createClient(url: string, key: string, options?: unknown): unknown {
      state.clientRequests.push({ url, key, options });

      return {
        auth: {
          async getSession() {
            if (state.readFailure !== null) {
              throw state.readFailure;
            }
            return { data: { session: state.session }, error: null };
          },
          async refreshSession() {
            if (state.refreshFailure !== null) {
              throw state.refreshFailure;
            }
            if (state.refreshRefusal !== null) {
              return { data: { session: null }, error: state.refreshRefusal };
            }
            state.session = state.renewed;
            return { data: { session: state.session }, error: null };
          },
        },
      };
    },
  };
});

vi.mock('@supabase/supabase-js', () => ({ createClient: sdk.createClient }));

function openSession(accessToken: string): SdkSession {
  return {
    access_token: accessToken,
    user: { id: 'user-1', app_metadata: { company_id: 'c1', role: 'EMPLOYER' } },
  };
}

afterEach(() => {
  sdk.reset();
  vi.unstubAllEnvs();
});

describe('SupabaseSessionClient', () => {
  it('builds the SDK client on the configured project url and anon key', () => {
    new SupabaseSessionClient(config);

    expect(sdk.state.clientRequests).toEqual([
      { url: 'https://project.test', key: 'anon-key', options: undefined },
    ]);
  });

  it('builds the client from the configuration, never from the environment', () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://decoy.test');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'decoy-key');

    new SupabaseSessionClient(config);

    expect(sdk.state.clientRequests).toEqual([
      { url: 'https://project.test', key: 'anon-key', options: undefined },
    ]);
  });

  it('hands back the token, the user and the metadata of the open session', async () => {
    sdk.state.session = openSession('access-token-1');

    await expect(new SupabaseSessionClient(config).getSession()).resolves.toEqual(
      {
        accessToken: 'access-token-1',
        userId: 'user-1',
        appMetadata: { company_id: 'c1', role: 'EMPLOYER' },
      },
    );
  });

  it('hands back nothing when nobody is signed in', async () => {
    sdk.state.session = null;

    await expect(
      new SupabaseSessionClient(config).getSession(),
    ).resolves.toBeNull();
  });

  it('hands back nothing when the SDK omits the session', async () => {
    sdk.state.session = undefined;

    await expect(
      new SupabaseSessionClient(config).getSession(),
    ).resolves.toBeNull();
  });

  it('propagates a failure to read the session', async () => {
    sdk.state.readFailure = new Error('session store unreachable');

    await expect(new SupabaseSessionClient(config).getSession()).rejects.toThrow(
      'session store unreachable',
    );
  });

  it('hands back the renewed session once it has been refreshed', async () => {
    sdk.state.session = openSession('access-token-1');
    sdk.state.renewed = openSession('access-token-2');
    const client = new SupabaseSessionClient(config);

    await client.refreshSession();

    await expect(client.getSession()).resolves.toEqual({
      accessToken: 'access-token-2',
      userId: 'user-1',
      appMetadata: { company_id: 'c1', role: 'EMPLOYER' },
    });
  });

  it('reports the refusal of the provider as the provider stated it', async () => {
    const refusal = new Error('refresh_token_not_found');
    sdk.state.session = openSession('access-token-1');
    sdk.state.refreshRefusal = refusal;

    await expect(
      new SupabaseSessionClient(config).refreshSession(),
    ).rejects.toBe(refusal);
  });

  it('resolves without a value when the refresh succeeds', async () => {
    sdk.state.session = openSession('access-token-1');
    sdk.state.renewed = openSession('access-token-2');

    await expect(
      new SupabaseSessionClient(config).refreshSession(),
    ).resolves.toBeUndefined();
  });

  it('propagates a transport failure during the refresh', async () => {
    sdk.state.refreshFailure = new Error('network unreachable');

    await expect(
      new SupabaseSessionClient(config).refreshSession(),
    ).rejects.toThrow('network unreachable');
  });
});
