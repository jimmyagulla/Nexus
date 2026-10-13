import {
  ActorContext,
  InvitedAccount,
} from '@hexagonal-monorepo-template/domain';

export interface IInviteEmployer {
  execute(input: {
    actor: ActorContext;
    identifier: string;
  }): Promise<InvitedAccount>;
}

export const IInviteEmployer = Symbol('IInviteEmployer');
