import { ActorContext } from './actor-context';
import { isUserRole } from './user-role';

const COMPANY_ID_CLAIM = 'company_id';
const ROLE_CLAIM = 'role';

function readClaim(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const claim = value.trim();
  return claim === '' ? null : claim;
}

export function toActorContext(
  userId: string,
  appMetadata: Readonly<Record<string, unknown>>,
): ActorContext {
  const companyId = readClaim(appMetadata[COMPANY_ID_CLAIM]);
  const role = readClaim(appMetadata[ROLE_CLAIM]);

  return {
    userId,
    companyId,
    role: role !== null && isUserRole(role) ? role : null,
  };
}
