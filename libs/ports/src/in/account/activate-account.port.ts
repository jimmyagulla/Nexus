export interface IActivateAccount {
  execute(input: {
    invitationToken: string;
    secret: string;
  }): Promise<void>;
}

export const IActivateAccount = Symbol('IActivateAccount');
