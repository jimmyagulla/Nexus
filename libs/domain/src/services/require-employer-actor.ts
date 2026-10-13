import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { requireActorRole } from './require-actor-role';
import { assertSameCompany } from './tenant-access';

export function requireEmployerActor(
  actor: ActorContext,
  companyId: string,
): void {
  requireActorRole(actor, UserRole.EMPLOYER);
  assertSameCompany(companyId, actor.companyId);
}
