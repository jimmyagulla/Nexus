import { ICompanyIdentityBinder } from '@hexagonal-monorepo-template/ports';

export class InMemoryCompanyIdentityBinder implements ICompanyIdentityBinder {
  readonly bindings = new Map<string, string>();

  async bindEmployer(userId: string, companyId: string): Promise<void> {
    this.bindings.set(userId, companyId);
  }
}
