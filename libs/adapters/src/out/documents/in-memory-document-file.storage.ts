import { DocumentFileLink } from '@hexagonal-monorepo-template/domain';
import {
  IDocumentFileStorage,
  StoredFile,
} from '@hexagonal-monorepo-template/ports';

/** Keeps files in the process. Links point nowhere real: `memory://<key>`. */
export class InMemoryDocumentFileStorage implements IDocumentFileStorage {
  readonly files = new Map<string, StoredFile>();

  async store(file: StoredFile): Promise<string> {
    const key = `${file.folder}/${globalThis.crypto.randomUUID()}`;
    this.files.set(key, file);
    return key;
  }

  async remove(key: string): Promise<void> {
    this.files.delete(key);
  }

  async linkTo(
    key: string,
    options: { downloadAs: string | null },
  ): Promise<DocumentFileLink> {
    const query =
      options.downloadAs === null
        ? ''
        : `?download=${encodeURIComponent(options.downloadAs)}`;
    return { url: `memory://${key}${query}` };
  }
}
