import { ISecretHasher } from '@hexagonal-monorepo-template/ports';

export class InMemorySecretHasher implements ISecretHasher {
  async hash(secret: string): Promise<string> {
    return `hashed:${secret}`;
  }

  async matches(secret: string, hash: string): Promise<boolean> {
    return hash === `hashed:${secret}`;
  }
}
