import {
  IDocumentFileStorage,
  StoredFile,
} from '@hexagonal-monorepo-template/ports';

/**
 * Keeps files in the process. A link is a `data:` URL carrying the file
 * itself, so that it can be opened or downloaded without any server.
 */
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

  async linkTo(key: string): Promise<string> {
    const file = this.files.get(key);
    if (file === undefined) {
      throw new Error(`No file is kept under ${key}`);
    }
    return `data:${file.contentType};base64,${this.base64(file.content)}`;
  }

  private base64(content: Uint8Array): string {
    let binary = '';
    for (const byte of content) {
      binary += String.fromCharCode(byte);
    }
    return btoa(binary);
  }
}
