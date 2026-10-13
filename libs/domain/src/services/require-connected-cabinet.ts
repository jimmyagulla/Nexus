import { CabinetConnection } from '../entities/cabinet-connection';
import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { assertSameCompany } from './tenant-access';

export function requireConnectedCabinet(
  actor: ActorContext,
  companyId: string,
  connection: CabinetConnection | null,
): void {
  assertSameCompany(companyId, actor.companyId);
  if (actor.role !== UserRole.ACCOUNTANT || connection?.isConnected() !== true) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
}
