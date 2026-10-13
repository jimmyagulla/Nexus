export interface ISecondFactorCodes {
  issueSecret(): string;
  provisioningUri(label: string, secret: string): string;
}

export const ISecondFactorCodes = Symbol('ISecondFactorCodes');
