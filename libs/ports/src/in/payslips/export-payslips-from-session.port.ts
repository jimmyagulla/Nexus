import {
  PayslipFileLink,
  PayslipListCriteria,
} from '@hexagonal-monorepo-template/domain';

/** The download links of every payslip a list shows. */
export interface IExportPayslipsFromSession {
  execute(criteria: PayslipListCriteria): Promise<PayslipFileLink[]>;
}

export const IExportPayslipsFromSession = Symbol('IExportPayslipsFromSession');
