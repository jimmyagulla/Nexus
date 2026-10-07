import { UserRole } from '@hexagonal-monorepo-template/domain';
import { ICompanyIdentityBinder } from '@hexagonal-monorepo-template/ports';
import {
  createSupabaseAdmin,
  type SupabaseServerConfig,
} from '@hexagonal-monorepo-template/infrastructure/supabase/server';

export class SupabaseCompanyIdentityBinder implements ICompanyIdentityBinder {
  private readonly admin: ReturnType<typeof createSupabaseAdmin>;

  constructor(config: SupabaseServerConfig) {
    this.admin = createSupabaseAdmin(config);
  }

  async bindEmployer(userId: string, companyId: string): Promise<void> {
    const { error } = await this.admin.auth.admin.updateUserById(userId, {
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
