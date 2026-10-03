import { BusinessError } from '../errors/business-error';
import { BusinessErrorCode } from '../errors/business-error-codes';

export function assertSameCompany(
  resourceCompanyId: string,
  actorCompanyId: string,
): void {
  if (resourceCompanyId !== actorCompanyId) {
    throw new BusinessError(BusinessErrorCode.NON_AUTORISE);
  }
}
