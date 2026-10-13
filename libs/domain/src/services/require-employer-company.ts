import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';

export function requireEmployerCompany(actor: ActorContext): string {
  if (actor.role !== UserRole.EMPLOYER || actor.companyId === null) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  return actor.companyId;
}
