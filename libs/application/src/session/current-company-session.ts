import {
  CompanyScopedSession,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import { ISessionGateway } from '@hexagonal-monorepo-template/ports';

/**
 * The session a "from session" use case acts in: signed in, inside a company.
 * A step those use cases share, not a use case: a use case never depends on
 * another one.
 */
export async function currentCompanySession(
  sessions: ISessionGateway,
): Promise<CompanyScopedSession> {
  return requireCompanyScopedSession(
    await sessions.getAccessToken(),
    await sessions.getActor(),
  );
}
