import {
  ActorContext,
  PayslipFileLink,
} from '@hexagonal-monorepo-template/domain';

export interface IDownloadPayslip {
  execute(input: {
    actor: ActorContext;
    payslipId: string;
  }): Promise<PayslipFileLink>;
}

export const IDownloadPayslip = Symbol('IDownloadPayslip');
