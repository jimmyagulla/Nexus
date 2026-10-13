export interface ISecondFactorCodes {
  generateSecret(): string;
  matches(secret: string, code: string, at: Date): Promise<boolean>;
}

export const ISecondFactorCodes = Symbol('ISecondFactorCodes');
