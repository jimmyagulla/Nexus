import { OwnerScope, PersonalInfo } from '@hexagonal-monorepo-template/domain';

export interface IPersonalInfoRepository {
  /** The information of the employee `scope.ownerId` in the company `scope.companyId`. */
  findByEmployee(scope: OwnerScope): Promise<PersonalInfo | null>;
  save(info: PersonalInfo): Promise<void>;
}

export const IPersonalInfoRepository = Symbol('IPersonalInfoRepository');
