import { toDataUrl } from '@hexagonal-monorepo-template/infrastructure';
import {
  IDocumentFileStorage,
  IIdGenerator,
  StoredFile,
} from '@hexagonal-monorepo-template/ports';

/**
 * Keeps files in the process. A link is a `data:` URL carrying the file
 * itself, so that it can be opened or downloaded without any server.
 */
export class InMemoryDocumentFileStorage implements IDocumentFileStorage {
  readonly files = new Map<string, StoredFile>();

  constructor(private readonly ids: IIdGenerator) {}

  async store(file: StoredFile): Promise<string> {
    const key = `${file.folder}/${this.ids.next()}`;
    this.files.set(key, file);
    return key;
  }

  async remove(key: string): Promise<void> {
    this.files.delete(key);
  }

  async linkTo(key: string): Promise<string> {
    const file = this.files.get(key);
    if (file === undefined) {
      throw new Error(`No file is kept under ${key}`);
    }
    return toDataUrl(file.contentType, file.content);
  }
}
