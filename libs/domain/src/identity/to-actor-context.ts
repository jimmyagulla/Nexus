import { ActorContext } from './actor-context';
import { isUserRole } from './user-role';

const COMPANY_ID_CLAIM = 'company_id';
const ROLE_CLAIM = 'role';
export const SECOND_FACTOR_VERIFIED_CLAIM = 'second_factor_verified';

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
  const actor: ActorContext = {
    userId,
    companyId,
    role: role !== null && isUserRole(role) ? role : null,
  };

  return appMetadata[SECOND_FACTOR_VERIFIED_CLAIM] === true
    ? { ...actor, secondFactorVerified: true }
    : actor;
}
