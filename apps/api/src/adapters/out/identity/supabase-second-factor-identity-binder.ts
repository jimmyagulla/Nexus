import { SECOND_FACTOR_VERIFIED_CLAIM } from '@hexagonal-monorepo-template/domain';
import { ISecondFactorIdentityBinder } from '@hexagonal-monorepo-template/ports';
import {
  createSupabaseAdmin,
  type SupabaseServerConfig,
} from '@hexagonal-monorepo-template/infrastructure/supabase/server';

export class SupabaseSecondFactorIdentityBinder
  implements ISecondFactorIdentityBinder
{
  private readonly admin: ReturnType<typeof createSupabaseAdmin>;

  constructor(config: SupabaseServerConfig) {
    this.admin = createSupabaseAdmin(config);
  }

  markVerified(userId: string): Promise<void> {
    return this.writeClaim(userId, true);
  }

  clearVerified(userId: string): Promise<void> {
    return this.writeClaim(userId, false);
  }

  private async writeClaim(userId: string, verified: boolean): Promise<void> {
    const { error } = await this.admin.auth.admin.updateUserById(userId, {
      app_metadata: { [SECOND_FACTOR_VERIFIED_CLAIM]: verified },
    });
    if (error) {
      throw error;
    }
  }
}
