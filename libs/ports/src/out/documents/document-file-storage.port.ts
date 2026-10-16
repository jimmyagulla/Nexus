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
   * A short-lived URL of the file. With `downloadAs`, following it saves the
   * file under that name instead of opening it.
   */
  linkTo(key: string, options: { downloadAs: string | null }): Promise<string>;
}

export const IDocumentFileStorage = Symbol('IDocumentFileStorage');
