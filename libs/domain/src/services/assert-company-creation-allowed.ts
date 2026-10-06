import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';

export function assertCompanyCreationAllowed(actor: ActorContext): void {
  if (actor.companyId !== null) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
}
