export interface ISecondFactorIdentityBinder {
  markVerified(userId: string): Promise<void>;
  clearVerified(userId: string): Promise<void>;
}

export const ISecondFactorIdentityBinder = Symbol(
  'ISecondFactorIdentityBinder',
);
