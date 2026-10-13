import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { assertSameCompany } from './tenant-access';

export function requireEmployerOfCompany(
  actor: ActorContext,
  companyId: string,
): void {
  if (actor.role !== UserRole.EMPLOYER) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }

  assertSameCompany(companyId, actor.companyId);
}
