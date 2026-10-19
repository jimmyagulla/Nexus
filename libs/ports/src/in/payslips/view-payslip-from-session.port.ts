import { PayslipFileLink } from '@hexagonal-monorepo-template/domain';

export interface IViewPayslipFromSession {
  execute(payslipId: string): Promise<PayslipFileLink>;
}

export const IViewPayslipFromSession = Symbol('IViewPayslipFromSession');
