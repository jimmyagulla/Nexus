import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { OwnerScope } from '../identity/owner-scope';

/** The scope of what an actor owns: their own records, in their company. */
export function requireOwnerScope(actor: ActorContext): OwnerScope {
  if (actor.companyId === null) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  return { companyId: actor.companyId, ownerId: actor.userId };
}
