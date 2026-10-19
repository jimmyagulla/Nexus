import { toDataUrl } from '@hexagonal-monorepo-template/infrastructure';
import {
  IExpenseReportProofStorage,
  IIdGenerator,
  StoredExpenseReportProof,
} from '@hexagonal-monorepo-template/ports';

/**
 * Keeps receipts in the process. A link is a `data:` URL carrying the file
 * itself, so that it can be opened without any server.
 */
export class InMemoryExpenseReportProofStorage implements IExpenseReportProofStorage {
  readonly files = new Map<string, StoredExpenseReportProof>();

  constructor(private readonly ids: IIdGenerator) {}

  async store(file: StoredExpenseReportProof): Promise<string> {
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
      throw new Error(`No receipt is kept under ${key}`);
    }
    return toDataUrl(file.contentType, file.content);
  }
}
