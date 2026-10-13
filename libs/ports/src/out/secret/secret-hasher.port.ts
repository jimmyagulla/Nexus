export interface ISecretHasher {
  hash(secret: string): Promise<string>;
  matches(secret: string, hash: string): Promise<boolean>;
}

export const ISecretHasher = Symbol('ISecretHasher');
