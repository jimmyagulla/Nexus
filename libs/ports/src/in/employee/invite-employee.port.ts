import {
  ActorContext,
  EmployeeInvitation,
} from '@hexagonal-monorepo-template/domain';

export interface IInviteEmployee {
  execute(input: {
    actor: ActorContext;
    employeeId: string;
    identifier: string;
  }): Promise<EmployeeInvitation>;
}

export const IInviteEmployee = Symbol('IInviteEmployee');
