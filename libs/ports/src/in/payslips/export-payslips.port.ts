import {
  ActorContext,
  PayslipFileLink,
  PayslipListCriteria,
} from '@hexagonal-monorepo-template/domain';

/** The download links of every payslip a list shows. */
export interface IExportPayslips {
  execute(input: {
    actor: ActorContext;
    criteria: PayslipListCriteria;
  }): Promise<PayslipFileLink[]>;
}

export const IExportPayslips = Symbol('IExportPayslips');
