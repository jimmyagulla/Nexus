import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { AuthGuard } from './auth.guard';
import { AuthenticatedRequest } from '../authenticated-request';

function contextOf(request: AuthenticatedRequest): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
}

describe('AuthGuard', () => {
  it('sets the actor from a bearer token', async () => {
    const actor = { userId: 'user-1', companyId: 'c1', role: null };
    const guard = new AuthGuard({
      verify: async () => actor,
    });
    const request: AuthenticatedRequest = {
      headers: { authorization: 'Bearer token' },
    };

    await expect(guard.canActivate(contextOf(request))).resolves.toBe(true);
    expect(request.actor).toEqual(actor);
  });

  it('refuses a missing token', async () => {
    const guard = new AuthGuard({
      verify: async () => {
        throw new Error('unused');
      },
    });

    await expect(
      guard.canActivate(contextOf({ headers: {} })),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('refuses an invalid token with ACCESS_DENIED', async () => {
    const guard = new AuthGuard({
      verify: async () => {
        throw new Error(ErrorCode.ACCESS_DENIED);
      },
    });

    await expect(
      guard.canActivate(
        contextOf({ headers: { authorization: 'Bearer bad' } }),
      ),
    ).rejects.toMatchObject({ message: ErrorCode.ACCESS_DENIED });
  });

  it('accepts a request without a token when authentication is disabled', async () => {
    const guard = new AuthGuard(
      {
        verify: async () => {
          throw new Error('unused');
        },
      },
      { authDisabled: true },
    );
    const request: AuthenticatedRequest = { headers: {} };

    await expect(guard.canActivate(contextOf(request))).resolves.toBe(true);
    expect(request.actor).toEqual({
      userId: 'local-dev-user',
      companyId: 'local-dev-company',
      role: 'EMPLOYER',
    });
  });

  it('skips documentation routes', async () => {
    const guard = new AuthGuard({
      verify: async () => {
        throw new Error('unused');
      },
    });

    await expect(
      guard.canActivate(contextOf({ headers: {}, url: '/api/docs' })),
    ).resolves.toBe(true);
  });
});
