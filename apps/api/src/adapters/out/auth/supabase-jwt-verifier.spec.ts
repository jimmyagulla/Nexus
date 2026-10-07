import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import type { JwtPayload } from '@hexagonal-monorepo-template/infrastructure';
import { SupabaseJwtVerifier } from './supabase-jwt-verifier';

const verifySignedJwt = vi.hoisted(() =>
  vi.fn<(token: string, jwksUrl: string) => Promise<JwtPayload>>(),
);

vi.mock('@hexagonal-monorepo-template/infrastructure', () => ({
  verifySignedJwt,
}));

const JWKS_URL = 'https://project.supabase.co/auth/v1/.well-known/jwks.json';

function signedPayload(payload: JwtPayload): void {
  verifySignedJwt.mockResolvedValue(payload);
}

function verifier(): SupabaseJwtVerifier {
  return new SupabaseJwtVerifier(JWKS_URL);
}

describe('SupabaseJwtVerifier', () => {
  beforeEach(() => {
    verifySignedJwt.mockReset();
  });

  it('builds an actor context from the company and role claims', async () => {
    signedPayload({
      sub: 'user-1',
      app_metadata: { company_id: 'company-1', role: UserRole.EMPLOYER },
    });

    await expect(verifier().verify('token')).resolves.toEqual({
      userId: 'user-1',
      companyId: 'company-1',
      role: UserRole.EMPLOYER,
    });
  });

  it.each([UserRole.EMPLOYER, UserRole.EMPLOYEE, UserRole.ACCOUNTANT])(
    'accepts the known role %s',
    async (role) => {
      signedPayload({
        sub: 'user-1',
        app_metadata: { company_id: 'company-1', role },
      });

      await expect(verifier().verify('token')).resolves.toMatchObject({ role });
    },
  );

  it('reports no company when the company claim is absent', async () => {
    signedPayload({
      sub: 'user-1',
      app_metadata: { role: UserRole.EMPLOYER },
    });

    await expect(verifier().verify('token')).resolves.toEqual({
      userId: 'user-1',
      companyId: null,
      role: UserRole.EMPLOYER,
    });
  });

  it('reports no role when the role claim is absent', async () => {
    signedPayload({
      sub: 'user-1',
      app_metadata: { company_id: 'company-1' },
    });

    await expect(verifier().verify('token')).resolves.toEqual({
      userId: 'user-1',
      companyId: 'company-1',
      role: null,
    });
  });

  it('reports no role when the role claim is not a known role', async () => {
    signedPayload({
      sub: 'user-1',
      app_metadata: { company_id: 'company-1', role: 'SUPERADMIN' },
    });

    await expect(verifier().verify('token')).resolves.toMatchObject({
      role: null,
    });
  });

  it('reports no company when the company claim is not a string', async () => {
    signedPayload({
      sub: 'user-1',
      app_metadata: { company_id: 42, role: UserRole.EMPLOYER },
    });

    await expect(verifier().verify('token')).resolves.toMatchObject({
      companyId: null,
    });
  });

  it.each([
    ['absent', undefined],
    ['null', null],
    ['a string', 'company-1'],
  ])(
    'reports neither company nor role when app_metadata is %s',
    async (_label, appMetadata) => {
      signedPayload({ sub: 'user-1', app_metadata: appMetadata });

      await expect(verifier().verify('token')).resolves.toEqual({
        userId: 'user-1',
        companyId: null,
        role: null,
      });
    },
  );

  it('denies access when the subject claim is absent', async () => {
    signedPayload({ app_metadata: { company_id: 'company-1' } });

    await expect(verifier().verify('token')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('denies access when the subject claim is empty', async () => {
    signedPayload({ sub: '', app_metadata: {} });

    await expect(verifier().verify('token')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('denies access when the subject claim is not a string', async () => {
    signedPayload({ sub: 1234, app_metadata: {} });

    await expect(verifier().verify('token')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('denies access when the signature check fails', async () => {
    verifySignedJwt.mockRejectedValue(new Error('signature verification failed'));

    await expect(verifier().verify('tampered')).rejects.toMatchObject({
      message: ErrorCode.ACCESS_DENIED,
    });
  });

  it('verifies the token against the configured jwks endpoint', async () => {
    signedPayload({ sub: 'user-1', app_metadata: {} });

    await verifier().verify('token');

    expect(verifySignedJwt).toHaveBeenCalledWith('token', JWKS_URL);
  });
});
