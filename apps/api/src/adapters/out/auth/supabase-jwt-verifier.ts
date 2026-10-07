import {
  ActorContext,
  ErrorCode,
  toActorContext,
} from '@hexagonal-monorepo-template/domain';
import { IJwtVerifier } from '@hexagonal-monorepo-template/ports';
import { verifySignedJwt } from '@hexagonal-monorepo-template/infrastructure';

export class SupabaseJwtVerifier implements IJwtVerifier {
  constructor(private readonly jwksUrl: string) {}

  async verify(token: string): Promise<ActorContext> {
    try {
      const payload = await verifySignedJwt(token, this.jwksUrl);
      if (typeof payload.sub !== 'string' || payload.sub === '') {
        throw new Error(ErrorCode.ACCESS_DENIED);
      }

      return toActorContext(payload.sub, readAppMetadata(payload.app_metadata));
    } catch {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
  }
}

function readAppMetadata(
  claim: unknown,
): Readonly<Record<string, unknown>> {
  if (claim === null || typeof claim !== 'object') {
    return {};
  }

  return claim as Record<string, unknown>;
}
