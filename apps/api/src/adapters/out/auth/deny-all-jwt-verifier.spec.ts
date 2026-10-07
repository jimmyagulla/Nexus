import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import type { IJwtVerifier } from '@hexagonal-monorepo-template/ports';
import { DenyAllJwtVerifier } from './deny-all-jwt-verifier';

describe('DenyAllJwtVerifier', () => {
  it('denies access whatever the token', async () => {
    const verifier: IJwtVerifier = new DenyAllJwtVerifier();

    await expect(verifier.verify('any-token')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('keeps denying access on repeated attempts', async () => {
    const verifier: IJwtVerifier = new DenyAllJwtVerifier();

    await expect(verifier.verify('first')).rejects.toMatchObject({
      message: ErrorCode.ACCESS_DENIED,
    });
    await expect(verifier.verify('second')).rejects.toMatchObject({
      message: ErrorCode.ACCESS_DENIED,
    });
  });
});
