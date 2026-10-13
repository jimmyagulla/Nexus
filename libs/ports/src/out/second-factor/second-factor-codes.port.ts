export interface ISecondFactorCodes {
  issueSecret(): string;
  provisioningUri(label: string, secret: string): string;
  verify(secret: string, code: string, at: Date): Promise<boolean>;
}

export const ISecondFactorCodes = Symbol('ISecondFactorCodes');
