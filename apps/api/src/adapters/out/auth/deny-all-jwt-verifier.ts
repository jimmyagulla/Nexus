import {
  ActorContext,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import { IJwtVerifier } from '@hexagonal-monorepo-template/ports';

export class DenyAllJwtVerifier implements IJwtVerifier {
  async verify(): Promise<ActorContext> {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
}
