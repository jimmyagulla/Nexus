import { verifySignedJwt } from './verify-signed-jwt';

const JWKS_URL = 'https://issuer.test/keys';

const signer = vi.hoisted(() => {
  const keySetRequests: string[] = [];
  const verifications: { token: string; keySet: unknown }[] = [];
  let outcome:
    | { verified: true; payload: unknown }
    | { verified: false; failure: Error } = { verified: true, payload: {} };

  return {
    keySetRequests,
    verifications,
    verifies(payload: unknown): void {
      outcome = { verified: true, payload };
    },
    refuses(failure: Error): void {
      outcome = { verified: false, failure };
    },
    reset(): void {
      keySetRequests.length = 0;
      verifications.length = 0;
      outcome = { verified: true, payload: {} };
    },
    createRemoteJWKSet(url: URL): unknown {
      keySetRequests.push(url.href);
      return { keySetOf: url.href };
    },
    async jwtVerify(
      token: string,
      keySet: unknown,
    ): Promise<{ payload: unknown }> {
      verifications.push({ token, keySet });
      if (!outcome.verified) {
        throw outcome.failure;
      }
      return { payload: outcome.payload };
    },
  };
});

vi.mock('jose', () => ({
  createRemoteJWKSet: signer.createRemoteJWKSet,
  jwtVerify: signer.jwtVerify,
}));

afterEach(() => {
  signer.reset();
});

describe('verifySignedJwt', () => {
  it('hands back the payload carried by a verified token', async () => {
    signer.verifies({ sub: 'user-1', app_metadata: { company_id: 'c1' } });

    await expect(verifySignedJwt('token-1', JWKS_URL)).resolves.toEqual({
      sub: 'user-1',
      app_metadata: { company_id: 'c1' },
    });
  });

  it('reads the signing keys from the given endpoint', async () => {
    await verifySignedJwt('token-1', JWKS_URL);

    expect(signer.keySetRequests).toEqual([JWKS_URL]);
  });

  it('verifies the token against the keys of that endpoint', async () => {
    await verifySignedJwt('token-1', JWKS_URL);

    expect(signer.verifications).toEqual([
      { token: 'token-1', keySet: { keySetOf: JWKS_URL } },
    ]);
  });

  it('hands back a payload without claims as it stands', async () => {
    signer.verifies({});

    await expect(verifySignedJwt('token-1', JWKS_URL)).resolves.toEqual({});
  });

  it('propagates the refusal of a token that does not verify', async () => {
    signer.refuses(new Error('signature verification failed'));

    await expect(verifySignedJwt('token-1', JWKS_URL)).rejects.toThrow(
      'signature verification failed',
    );
  });

  it('refuses a malformed endpoint without verifying anything', async () => {
    await expect(verifySignedJwt('token-1', 'issuer.test/keys')).rejects.toThrow(
      TypeError,
    );
    expect(signer.verifications).toEqual([]);
  });
});
