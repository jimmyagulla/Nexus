import {
  PersonalContactValues,
  PersonalInfoSnapshot,
} from '@hexagonal-monorepo-template/domain';

/** The signed-in employee changes their own contact details. */
export interface IUpdatePersonalContactFromSession {
  execute(contact: PersonalContactValues): Promise<PersonalInfoSnapshot>;
}

export const IUpdatePersonalContactFromSession = Symbol('IUpdatePersonalContactFromSession');
