import { ISecondFactorIdentityBinder } from '@hexagonal-monorepo-template/ports';

export class InMemorySecondFactorIdentityBinder
  implements ISecondFactorIdentityBinder
{
  readonly verified = new Set<string>();

  async markVerified(userId: string): Promise<void> {
    this.verified.add(userId);
  }

  async clearVerified(userId: string): Promise<void> {
    this.verified.delete(userId);
  }
}
