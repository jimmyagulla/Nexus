import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';

export function assertEmployerActor(actor: ActorContext): void {
  if (actor.role !== UserRole.EMPLOYER) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
}
