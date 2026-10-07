import { describe, expect, it } from 'vitest';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { SessionRecord } from '@hexagonal-monorepo-template/ports';
import { ClientSessionGateway } from './client-session.gateway';
import { InMemorySessionClient } from './in-memory-session.client';

const signedIn: SessionRecord = {
  accessToken: 'token',
  userId: 'user-1',
  appMetadata: { company_id: 'c1', role: UserRole.EMPLOYER },
};

describe('ClientSessionGateway', () => {
  it('hands back the access token of the current session', async () => {
    const sessions = new ClientSessionGateway(
      new InMemorySessionClient(signedIn),
    );

    await expect(sessions.getAccessToken()).resolves.toBe('token');
  });

  it('hands back no token without a session', async () => {
    const sessions = new ClientSessionGateway(new InMemorySessionClient(null));

    await expect(sessions.getAccessToken()).resolves.toBeNull();
  });

  it('builds the actor from the session claims', async () => {
    const sessions = new ClientSessionGateway(
      new InMemorySessionClient(signedIn),
    );

    await expect(sessions.getActor()).resolves.toEqual({
      userId: 'user-1',
      companyId: 'c1',
      role: UserRole.EMPLOYER,
    });
  });

  it('hands back no actor without a session', async () => {
    const sessions = new ClientSessionGateway(new InMemorySessionClient(null));

    await expect(sessions.getActor()).resolves.toBeNull();
  });

  it('leaves the company empty when the session carries no claim', async () => {
    const sessions = new ClientSessionGateway(
      new InMemorySessionClient({ ...signedIn, appMetadata: {} }),
    );

    await expect(sessions.getActor()).resolves.toEqual({
      userId: 'user-1',
      companyId: null,
      role: null,
    });
  });

  it('refreshes the session through the client', async () => {
    const client = new InMemorySessionClient(signedIn);
    const sessions = new ClientSessionGateway(client);

    await sessions.refresh();

    expect(client.refreshes).toBe(1);
  });
});
