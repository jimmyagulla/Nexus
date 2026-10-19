import {
  ActorContext,
  PersonalContactValues,
  PersonalInfoSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IUpdatePersonalContact {
  execute(input: {
    actor: ActorContext;
    employeeId: string;
    contact: PersonalContactValues;
  }): Promise<PersonalInfoSnapshot>;
}

export const IUpdatePersonalContact = Symbol('IUpdatePersonalContact');
