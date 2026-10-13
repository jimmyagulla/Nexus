import { Employee } from '../entities/employee';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { requireActiveEmployee } from './require-active-employee';
import { requireActorRole } from './require-actor-role';
import { assertSameCompany } from './tenant-access';

export function requireActiveEmployeeActor(
  actor: ActorContext,
  companyId: string,
  employee: Employee | null,
): Employee {
  requireActorRole(actor, UserRole.EMPLOYEE);
  assertSameCompany(companyId, actor.companyId);
  return requireActiveEmployee(employee);
}
