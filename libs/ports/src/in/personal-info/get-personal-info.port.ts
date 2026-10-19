import {
  ActorContext,
  PersonalInfoSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IGetPersonalInfo {
  execute(input: {
    actor: ActorContext;
    employeeId: string;
  }): Promise<PersonalInfoSnapshot>;
}

export const IGetPersonalInfo = Symbol('IGetPersonalInfo');
