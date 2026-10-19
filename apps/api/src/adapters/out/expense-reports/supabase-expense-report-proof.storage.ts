import {
  IExpenseReportProofStorage,
  IIdGenerator,
  StoredExpenseReportProof,
} from '@hexagonal-monorepo-template/ports';
import {
  createSupabaseAdmin,
  type SupabaseServerConfig,
} from '@hexagonal-monorepo-template/infrastructure/supabase/server';

/** Private bucket created by prisma/sql/expense-reports.sql. */
const EXPENSE_REPORT_PROOFS_BUCKET = 'expense-report-proofs';
/** A link is only meant to be opened right away. */
const LINK_LIFETIME_SECONDS = 60;

export class SupabaseExpenseReportProofStorage implements IExpenseReportProofStorage {
  private readonly admin: ReturnType<typeof createSupabaseAdmin>;

  constructor(
    config: SupabaseServerConfig,
    private readonly ids: IIdGenerator,
  ) {
    this.admin = createSupabaseAdmin(config);
  }

  async store(file: StoredExpenseReportProof): Promise<string> {
    const key = `${file.folder}/${this.ids.next()}`;
    const { error } = await this.bucket().upload(key, file.content, {
      contentType: file.contentType,
      upsert: false,
    });
    if (error) {
      throw error;
    }
    return key;
  }

  async remove(key: string): Promise<void> {
    const { error } = await this.bucket().remove([key]);
    if (error) {
      throw error;
    }
  }

  async linkTo(
    key: string,
    options: { downloadAs: string | null },
  ): Promise<string> {
    const { data, error } = await this.bucket().createSignedUrl(
      key,
      LINK_LIFETIME_SECONDS,
      options.downloadAs === null ? undefined : { download: options.downloadAs },
    );
    if (error) {
      throw error;
    }
    return data.signedUrl;
  }

  private bucket() {
    return this.admin.storage.from(EXPENSE_REPORT_PROOFS_BUCKET);
  }
}
