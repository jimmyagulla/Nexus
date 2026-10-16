import { randomUUID } from 'node:crypto';
import { DocumentFileLink } from '@hexagonal-monorepo-template/domain';
import {
  IDocumentFileStorage,
  StoredFile,
} from '@hexagonal-monorepo-template/ports';
import {
  createSupabaseAdmin,
  type SupabaseServerConfig,
} from '@hexagonal-monorepo-template/infrastructure/supabase/server';

/** Private bucket created by prisma/sql/documents.sql. */
const DOCUMENTS_BUCKET = 'documents';
/** A link is only meant to be opened right away. */
const LINK_LIFETIME_SECONDS = 60;

export class SupabaseDocumentFileStorage implements IDocumentFileStorage {
  private readonly admin: ReturnType<typeof createSupabaseAdmin>;

  constructor(config: SupabaseServerConfig) {
    this.admin = createSupabaseAdmin(config);
  }

  async store(file: StoredFile): Promise<string> {
    const key = `${file.folder}/${randomUUID()}`;
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
  ): Promise<DocumentFileLink> {
    const { data, error } = await this.bucket().createSignedUrl(
      key,
      LINK_LIFETIME_SECONDS,
      options.downloadAs === null ? undefined : { download: options.downloadAs },
    );
    if (error) {
      throw error;
    }
    return { url: data.signedUrl };
  }

  private bucket() {
    return this.admin.storage.from(DOCUMENTS_BUCKET);
  }
}
