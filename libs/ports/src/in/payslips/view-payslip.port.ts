import {
  ActorContext,
  PayslipFileLink,
} from '@hexagonal-monorepo-template/domain';

export interface IViewPayslip {
  execute(input: {
    actor: ActorContext;
    payslipId: string;
  }): Promise<PayslipFileLink>;
}

export const IViewPayslip = Symbol('IViewPayslip');
