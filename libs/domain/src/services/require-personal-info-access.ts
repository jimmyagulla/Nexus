import { PersonalInfo } from '../entities/personal-info';
import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';

/**
 * The employee reads their own information, an employer those of the
 * employees of their company. Information out of reach is refused exactly
 * like missing ones, so that their existence never leaks.
 */
export function requireReadablePersonalInfo(
  info: PersonalInfo | null,
  actor: ActorContext,
): PersonalInfo {
  if (info === null || !info.isReadableBy(actor)) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  return info;
}

/** Only the employee themselves changes their contact details. */
export function requireEditablePersonalInfo(
  info: PersonalInfo | null,
  actor: ActorContext,
): PersonalInfo {
  if (info === null || !info.isEditableBy(actor)) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  return info;
}
