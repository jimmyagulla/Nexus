import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';

export type CompanyScopedSession = {
  token: string;
  companyId: string;
};

export function requireCompanyScopedSession(
  token: string | null,
  actor: ActorContext | null,
): CompanyScopedSession {
  if (token === null || actor === null || actor.companyId === null) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }

  return { token, companyId: actor.companyId };
}
