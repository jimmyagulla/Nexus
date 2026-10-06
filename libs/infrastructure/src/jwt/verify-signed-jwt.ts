import { createRemoteJWKSet, jwtVerify } from 'jose';

export type JwtPayload = {
  sub?: unknown;
  app_metadata?: unknown;
};

export async function verifySignedJwt(
  token: string,
  jwksUrl: string,
): Promise<JwtPayload> {
  const jwks = createRemoteJWKSet(new URL(jwksUrl));
  const { payload } = await jwtVerify(token, jwks);
  return payload;
}
