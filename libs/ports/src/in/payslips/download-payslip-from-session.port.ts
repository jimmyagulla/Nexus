import { PayslipFileLink } from '@hexagonal-monorepo-template/domain';

export interface IDownloadPayslipFromSession {
  execute(payslipId: string): Promise<PayslipFileLink>;
}

export const IDownloadPayslipFromSession = Symbol(
  'IDownloadPayslipFromSession',
);
