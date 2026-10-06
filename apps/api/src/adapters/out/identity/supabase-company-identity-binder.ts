import { ICompanyIdentityBinder } from '@hexagonal-monorepo-template/ports';
import { createSupabaseAdmin } from '@hexagonal-monorepo-template/infrastructure';
import { UserRole } from '@hexagonal-monorepo-template/domain';

export class SupabaseCompanyIdentityBinder implements ICompanyIdentityBinder {
  constructor(
    private readonly url: string,
    private readonly serviceRoleKey: string,
  ) {}

  async bindEmployer(userId: string, companyId: string): Promise<void> {
    const admin = createSupabaseAdmin(this.url, this.serviceRoleKey);
    const { error } = await admin.auth.admin.updateUserById(userId, {
      app_metadata: {
        company_id: companyId,
        role: UserRole.EMPLOYER,
      },
    });
    if (error) {
      throw error;
    }
  }
}
