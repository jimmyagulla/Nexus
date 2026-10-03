import { ErrorMessage } from '../errors/error-message';

export function assertSameCompany(
  resourceCompanyId: string,
  actorCompanyId: string,
): void {
  if (resourceCompanyId !== actorCompanyId) {
    throw new Error(ErrorMessage.NON_AUTORISE);
  }
}
