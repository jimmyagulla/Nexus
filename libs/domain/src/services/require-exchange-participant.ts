import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { assertSameCompany } from './tenant-access';

export function requireExchangeParticipant(
  actor: ActorContext,
  companyId: string,
): void {
  assertSameCompany(companyId, actor.companyId);
  if (actor.role !== UserRole.EMPLOYER && actor.role !== UserRole.ACCOUNTANT) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
}
