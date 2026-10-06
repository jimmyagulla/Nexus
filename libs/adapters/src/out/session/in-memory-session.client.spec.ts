import { describe, expect, it } from 'vitest';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { SessionRecord } from '@hexagonal-monorepo-template/ports';
import { InMemorySessionClient } from './in-memory-session.client';

const signedIn: SessionRecord = {
  accessToken: 'token',
  userId: 'user-1',
  appMetadata: { company_id: 'c1', role: UserRole.EMPLOYER },
};

describe('InMemorySessionClient', () => {
  it('hands back the session it was built with', async () => {
    const client = new InMemorySessionClient(signedIn);

    await expect(client.getSession()).resolves.toEqual(signedIn);
  });

  it('hands back no session when it carries none', async () => {
    const client = new InMemorySessionClient(null);

    await expect(client.getSession()).resolves.toBeNull();
  });

  it('counts no refresh before being asked', () => {
    const client = new InMemorySessionClient(signedIn);

    expect(client.refreshes).toBe(0);
  });

  it('records every refresh it is asked for', async () => {
    const client = new InMemorySessionClient(signedIn);

    await client.refreshSession();
    await client.refreshSession();

    expect(client.refreshes).toBe(2);
  });

  it('leaves the session untouched by a refresh', async () => {
    const client = new InMemorySessionClient(signedIn);

    await client.refreshSession();

    await expect(client.getSession()).resolves.toEqual(signedIn);
  });
});
