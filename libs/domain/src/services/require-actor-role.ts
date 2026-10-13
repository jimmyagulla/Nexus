import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';

export function requireActorRole(
  actor: ActorContext,
  ...roles: readonly UserRole[]
): void {
  if (actor.role === null || !roles.includes(actor.role)) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
}
