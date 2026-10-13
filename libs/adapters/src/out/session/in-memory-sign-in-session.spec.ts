import { describe, expect, it } from 'vitest';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { InMemorySignInSession } from './in-memory-sign-in-session';

describe('InMemorySignInSession', () => {
  it('opens a session for the signed-in employer', async () => {
    const sessions = new InMemorySignInSession();

    await expect(
      sessions.open({
        userId: 'founder',
        companyId: 'company-1',
        role: UserRole.EMPLOYER,
      }),
    ).resolves.toEqual({
      accessToken: 'session:founder',
      companyId: 'company-1',
      role: UserRole.EMPLOYER,
    });
  });
});
