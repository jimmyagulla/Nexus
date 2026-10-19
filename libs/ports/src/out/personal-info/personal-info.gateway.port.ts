import {
  PersonalContactValues,
  PersonalInfoSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IPersonalInfoGateway {
  get(companyId: string, employeeId: string, token: string): Promise<PersonalInfoSnapshot>;
  updateContact(
    companyId: string,
    employeeId: string,
    contact: PersonalContactValues,
    token: string,
  ): Promise<PersonalInfoSnapshot>;
}

export const IPersonalInfoGateway = Symbol('IPersonalInfoGateway');
