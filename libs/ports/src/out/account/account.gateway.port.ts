export interface IAccountGateway {
  activate(input: {
    invitationToken: string;
    secret: string;
  }): Promise<void>;
}

export const IAccountGateway = Symbol('IAccountGateway');
