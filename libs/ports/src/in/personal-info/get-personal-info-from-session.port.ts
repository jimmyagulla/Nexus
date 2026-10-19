import { PersonalInfoSnapshot } from '@hexagonal-monorepo-template/domain';

/** The personal information of the signed-in employee. */
export interface IGetPersonalInfoFromSession {
  execute(): Promise<PersonalInfoSnapshot>;
}

export const IGetPersonalInfoFromSession = Symbol('IGetPersonalInfoFromSession');
