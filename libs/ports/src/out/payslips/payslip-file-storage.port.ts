/** Keeps the files of payslips out of the database. */
export interface IPayslipFileStorage {
  /**
   * A short-lived URL of the file. With `downloadAs`, following it saves the
   * file under that name instead of opening it.
   */
  linkTo(key: string, options: { downloadAs: string | null }): Promise<string>;
}

export const IPayslipFileStorage = Symbol('IPayslipFileStorage');
