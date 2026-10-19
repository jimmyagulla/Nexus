export type StoredExpenseReportProof = {
  /** Folder the receipt is kept in, e.g. `<companyId>/<ownerId>`. */
  folder: string;
  contentType: string;
  content: Uint8Array;
};

/** Keeps the receipts of expense reports out of the database. */
export interface IExpenseReportProofStorage {
  /** Stores a receipt and hands back the key it is kept under. */
  store(file: StoredExpenseReportProof): Promise<string>;
  remove(key: string): Promise<void>;
  /**
   * A short-lived URL of the receipt. With `downloadAs`, following it saves
   * the file under that name instead of opening it.
   */
  linkTo(key: string, options: { downloadAs: string | null }): Promise<string>;
}

export const IExpenseReportProofStorage = Symbol('IExpenseReportProofStorage');
