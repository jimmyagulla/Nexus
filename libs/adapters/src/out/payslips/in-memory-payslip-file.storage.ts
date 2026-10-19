import { toDataUrl } from '@hexagonal-monorepo-template/infrastructure';
import { IPayslipFileStorage } from '@hexagonal-monorepo-template/ports';

/** A file kept by the in-memory payslip storage. */
export type InMemoryPayslipFile = {
  contentType: string;
  content: Uint8Array;
};

/**
 * Keeps the files of payslips in the process, per storage key. A link is a
 * `data:` URL carrying the file itself, so that it opens without any server.
 */
export class InMemoryPayslipFileStorage implements IPayslipFileStorage {
  constructor(readonly files = new Map<string, InMemoryPayslipFile>()) {}

  async linkTo(key: string): Promise<string> {
    const file = this.files.get(key);
    if (file === undefined) {
      throw new Error(`No file is kept under ${key}`);
    }
    return toDataUrl(file.contentType, file.content);
  }
}
