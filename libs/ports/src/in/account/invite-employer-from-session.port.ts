import { InvitedAccount } from '@hexagonal-monorepo-template/domain';

export interface IInviteEmployerFromSession {
  execute(identifier: string): Promise<InvitedAccount>;
}

export const IInviteEmployerFromSession = Symbol('IInviteEmployerFromSession');
