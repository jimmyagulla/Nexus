import { afterEach, describe, expect, it, vi } from 'vitest';
import { createHttpClient } from './create-http-client';

type RecordedCall = { url: string; headers: Record<string, string> };

function stubApiReturning(data: unknown): RecordedCall[] {
  const calls: RecordedCall[] = [];

  vi.stubGlobal(
    'fetch',
    async (url: string, init: { headers: Record<string, string> }) => {
      calls.push({ url, headers: init.headers });
      return { ok: true, status: 200, json: async () => ({ data }) };
    },
  );

  return calls;
}

describe('createHttpClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('does not let its caller choose the api it targets', () => {
    expect(createHttpClient.length).toBe(0);
  });

  it('resolves the configured api on its own', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.nexus.test/api');
    const calls = stubApiReturning({ id: 'c1' });

    await createHttpClient().request({
      method: 'GET',
      path: 'companies/c1/settings',
    });

    expect(calls.map((call) => call.url)).toEqual([
      'https://api.nexus.test/api/companies/c1/settings',
    ]);
  });

  it('falls back on the local api when none is configured', async () => {
    vi.stubEnv('VITE_API_URL', '');
    const calls = stubApiReturning({ id: 'c1' });

    await createHttpClient().request({
      method: 'GET',
      path: 'companies/c1/settings',
    });

    expect(calls.map((call) => call.url)).toEqual([
      'http://localhost:3000/api/companies/c1/settings',
    ]);
  });

  it('hands back a client that unwraps what the api answers', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.nexus.test/api');
    stubApiReturning({ id: 'c1', name: 'Acme' });

    await expect(
      createHttpClient().request({
        method: 'GET',
        path: 'companies/c1/settings',
      }),
    ).resolves.toEqual({ id: 'c1', name: 'Acme' });
  });

  it('hands back a client that carries the session token', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.nexus.test/api');
    const calls = stubApiReturning({ id: 'c1' });

    await createHttpClient().request({
      method: 'GET',
      path: 'companies/c1/settings',
      token: 'jwt',
    });

    expect(calls[0]?.headers['Authorization']).toBe('Bearer jwt');
  });
});
