export interface IActivateEmployeeAccount {
  execute(input: { invitationToken: string; secret: string }): Promise<void>;
}

export const IActivateEmployeeAccount = Symbol('IActivateEmployeeAccount');
