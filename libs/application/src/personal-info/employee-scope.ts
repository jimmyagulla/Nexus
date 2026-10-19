import { ActorContext, OwnerScope, requireOwnerScope } from '@hexagonal-monorepo-template/domain';

/**
 * Where the information of an employee are looked for: in the company of the
 * actor, never in another one.
 */
export function employeeScope(actor: ActorContext, employeeId: string): OwnerScope {
  return { companyId: requireOwnerScope(actor).companyId, ownerId: employeeId };
}
