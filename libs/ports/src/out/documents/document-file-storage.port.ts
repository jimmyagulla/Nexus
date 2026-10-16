import { DocumentFileLink } from '@hexagonal-monorepo-template/domain';

export type StoredFile = {
  /** Folder the file is kept in, e.g. `<companyId>/<ownerId>`. */
  folder: string;
  contentType: string;
  content: Uint8Array;
};

/** Keeps the files of documents out of the database. */
export interface IDocumentFileStorage {
  /** Stores a file and hands back the key it is kept under. */
  store(file: StoredFile): Promise<string>;
  remove(key: string): Promise<void>;
  /**
   * A short-lived link to the file. With `downloadAs`, the link saves the
   * file under that name instead of opening it.
   */
  linkTo(key: string, options: { downloadAs: string | null }): Promise<DocumentFileLink>;
}

export const IDocumentFileStorage = Symbol('IDocumentFileStorage');
