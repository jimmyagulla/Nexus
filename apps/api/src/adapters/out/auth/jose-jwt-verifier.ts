import {
  ActorContext,
  ErrorCode,
  isUserRole,
} from '@hexagonal-monorepo-template/domain';
import { IJwtVerifier } from '@hexagonal-monorepo-template/ports';
import { verifySignedJwt } from '@hexagonal-monorepo-template/infrastructure';

export class JoseJwtVerifier implements IJwtVerifier {
  constructor(private readonly jwksUrl: string) {}

  async verify(token: string): Promise<ActorContext> {
    try {
      const payload = await verifySignedJwt(token, this.jwksUrl);
      if (typeof payload.sub !== 'string' || payload.sub === '') {
        throw new Error(ErrorCode.ACCESS_DENIED);
      }
      const metadata =
        payload.app_metadata !== null &&
        typeof payload.app_metadata === 'object'
          ? (payload.app_metadata as Record<string, unknown>)
          : {};
      const companyId =
        typeof metadata.company_id === 'string' ? metadata.company_id : null;
      const role =
        typeof metadata.role === 'string' && isUserRole(metadata.role)
          ? metadata.role
          : null;
      return { userId: payload.sub, companyId, role };
    } catch {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
  }
}
