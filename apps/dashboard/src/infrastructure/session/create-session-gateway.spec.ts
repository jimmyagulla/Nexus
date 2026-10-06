import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { createSessionGateway } from './create-session-gateway';

type SessionRecord = {
  accessToken: string;
  userId: string;
  appMetadata: Readonly<Record<string, unknown>>;
};

const supabase = vi.hoisted(() => ({
  configs: [] as { url: string; anonKey: string }[],
  session: null as SessionRecord | null,
  refreshes: 0,
  renewalRefused: false,
}));

vi.mock('@hexagonal-monorepo-template/infrastructure/supabase/browser', () => ({
  SupabaseSessionClient: class {
    constructor(config: { url: string; anonKey: string }) {
      supabase.configs.push(config);
    }

    async getSession(): Promise<SessionRecord | null> {
      return supabase.session;
    }

    async refreshSession(): Promise<void> {
      supabase.refreshes += 1;
      if (supabase.renewalRefused) {
        throw new Error('refresh_token_not_found');
      }
    }
  },
}));

describe('createSessionGateway', () => {
  beforeEach(() => {
    supabase.configs.length = 0;
    supabase.session = null;
    supabase.refreshes = 0;
    supabase.renewalRefused = false;
    vi.stubEnv('VITE_AUTH_DISABLED', 'false');
    vi.stubEnv('VITE_SUPABASE_URL', 'https://project.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses the local in-memory employer when authentication is disabled', async () => {
    vi.stubEnv('VITE_AUTH_DISABLED', 'true');

    await expect(createSessionGateway().getActor()).resolves.toEqual({
      userId: 'local-dev-user',
      companyId: 'local-dev-company',
      role: UserRole.EMPLOYER,
    });
    expect(supabase.configs).toEqual([]);
  });

  it('reads the supabase project from the environment', () => {
    createSessionGateway();

    expect(supabase.configs).toEqual([
      { url: 'https://project.supabase.co', anonKey: 'anon' },
    ]);
  });

  it('reports no token while nobody is signed in', async () => {
    await expect(createSessionGateway().getAccessToken()).resolves.toBeNull();
  });

  it('reports no actor while nobody is signed in', async () => {
    await expect(createSessionGateway().getActor()).resolves.toBeNull();
  });

  it('reports the token of the signed-in user', async () => {
    supabase.session = {
      accessToken: 'jwt',
      userId: 'u1',
      appMetadata: {},
    };

    await expect(createSessionGateway().getAccessToken()).resolves.toBe('jwt');
  });

  it('reports the company and the role the session carries', async () => {
    supabase.session = {
      accessToken: 'jwt',
      userId: 'u1',
      appMetadata: { company_id: 'c1', role: UserRole.EMPLOYER },
    };

    await expect(createSessionGateway().getActor()).resolves.toEqual({
      userId: 'u1',
      companyId: 'c1',
      role: UserRole.EMPLOYER,
    });
  });

  it('reports no company when the session carries none', async () => {
    supabase.session = {
      accessToken: 'jwt',
      userId: 'u1',
      appMetadata: {},
    };

    await expect(createSessionGateway().getActor()).resolves.toEqual({
      userId: 'u1',
      companyId: null,
      role: null,
    });
  });

  it('reports no company when the company claim is blank', async () => {
    supabase.session = {
      accessToken: 'jwt',
      userId: 'u1',
      appMetadata: { company_id: '   ', role: UserRole.EMPLOYER },
    };

    await expect(createSessionGateway().getActor()).resolves.toMatchObject({
      companyId: null,
    });
  });

  it('reports no role when the claim names a role the domain ignores', async () => {
    supabase.session = {
      accessToken: 'jwt',
      userId: 'u1',
      appMetadata: { company_id: 'c1', role: 'SUPERVISOR' },
    };

    await expect(createSessionGateway().getActor()).resolves.toMatchObject({
      companyId: 'c1',
      role: null,
    });
  });

  it('asks supabase to refresh the session', async () => {
    await createSessionGateway().refresh();

    expect(supabase.refreshes).toBe(1);
  });

  it('hands the refusal of the renewal over to its caller', async () => {
    supabase.renewalRefused = true;

    await expect(createSessionGateway().refresh()).rejects.toThrow(
      'refresh_token_not_found',
    );
  });
});
