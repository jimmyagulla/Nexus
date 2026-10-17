import { describe, expect, it } from 'vitest';
import { InMemorySessionGateway } from '@hexagonal-monorepo-template/adapters';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { currentCompanySession } from './current-company-session';

describe('currentCompanySession', () => {
  it('reads the token and the company of the signed-in actor', async () => {
    const sessions = new InMemorySessionGateway('token-1', {
      userId: 'u1',
      companyId: 'c1',
      role: UserRole.EMPLOYEE,
    });

    await expect(currentCompanySession(sessions)).resolves.toEqual({
      token: 'token-1',
      companyId: 'c1',
    });
  });

  it('refuses an actor outside any company', async () => {
    const sessions = new InMemorySessionGateway('token-1', {
      userId: 'u1',
      companyId: null,
      role: UserRole.EMPLOYEE,
    });

    await expect(currentCompanySession(sessions)).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
