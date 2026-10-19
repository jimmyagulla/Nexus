import { FileLink } from './file-link';
import { PayslipSummary } from './payslip-summary';

/** The payslips a list shows, January to December, with what the year picker needs. */
export type PayslipList = {
  items: readonly PayslipSummary[];
  /** Every payslip of the employee, whatever the criteria. */
  total: number;
  /** Years the employee has a payslip in, oldest first, whatever the criteria. */
  years: readonly number[];
};

/** Link to the file of one payslip, valid for a short while. */
export type PayslipFileLink = FileLink & {
  payslipId: string;
};
