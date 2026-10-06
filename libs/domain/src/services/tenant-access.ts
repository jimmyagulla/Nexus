import { ErrorCode } from '../errors/error-code';

export function assertSameCompany(
  resourceCompanyId: string,
  actorCompanyId: string | null,
): void {
  if (actorCompanyId === null || resourceCompanyId !== actorCompanyId) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
}
