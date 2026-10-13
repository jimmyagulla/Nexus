export interface IRecoveryCodes {
  generate(count: number): readonly string[];
  digest(code: string): Promise<string>;
}

export const IRecoveryCodes = Symbol('IRecoveryCodes');
