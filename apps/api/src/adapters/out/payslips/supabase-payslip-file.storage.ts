import { IPayslipFileStorage } from '@hexagonal-monorepo-template/ports';
import {
  createSupabaseAdmin,
  type SupabaseServerConfig,
} from '@hexagonal-monorepo-template/infrastructure/supabase/server';

/** Private bucket created by prisma/sql/payslips.sql. */
const PAYSLIPS_BUCKET = 'payslips';
/** A link is only meant to be opened right away. */
const LINK_LIFETIME_SECONDS = 60;

export class SupabasePayslipFileStorage implements IPayslipFileStorage {
  private readonly admin: ReturnType<typeof createSupabaseAdmin>;

  constructor(config: SupabaseServerConfig) {
    this.admin = createSupabaseAdmin(config);
  }

  async linkTo(
    key: string,
    options: { downloadAs: string | null },
  ): Promise<string> {
    const { data, error } = await this.admin.storage
      .from(PAYSLIPS_BUCKET)
      .createSignedUrl(
        key,
        LINK_LIFETIME_SECONDS,
        options.downloadAs === null ? undefined : { download: options.downloadAs },
      );
    if (error) {
      throw error;
    }
    return data.signedUrl;
  }
}
