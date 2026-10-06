import { describe, expect, it } from 'vitest';
import {
  ActorContext,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { InMemorySessionGateway } from './in-memory-session.gateway';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

describe('InMemorySessionGateway', () => {
  it('hands back the token it was built with', async () => {
    const sessions = new InMemorySessionGateway('token', actor);

    await expect(sessions.getAccessToken()).resolves.toBe('token');
  });

  it('hands back no token when it carries none', async () => {
    const sessions = new InMemorySessionGateway(null, actor);

    await expect(sessions.getAccessToken()).resolves.toBeNull();
  });

  it('hands back the actor it was built with', async () => {
    const sessions = new InMemorySessionGateway('token', actor);

    await expect(sessions.getActor()).resolves.toEqual(actor);
  });

  it('hands back no actor when it carries none', async () => {
    const sessions = new InMemorySessionGateway('token', null);

    await expect(sessions.getActor()).resolves.toBeNull();
  });

  it('counts no refresh before being asked', () => {
    const sessions = new InMemorySessionGateway('token', actor);

    expect(sessions.refreshes).toBe(0);
  });

  it('records every refresh it is asked for', async () => {
    const sessions = new InMemorySessionGateway('token', actor);

    await sessions.refresh();
    await sessions.refresh();

    expect(sessions.refreshes).toBe(2);
  });

  it('leaves the token and the actor untouched by a refresh', async () => {
    const sessions = new InMemorySessionGateway('token', actor);

    await sessions.refresh();

    await expect(sessions.getAccessToken()).resolves.toBe('token');
    await expect(sessions.getActor()).resolves.toEqual(actor);
  });
});
