import {
  PayslipFileLink,
  PayslipList,
  PayslipListCriteria,
} from '@hexagonal-monorepo-template/domain';

export interface IPayslipGateway {
  list(
    companyId: string,
    criteria: PayslipListCriteria,
    token: string,
  ): Promise<PayslipList>;
  view(companyId: string, payslipId: string, token: string): Promise<PayslipFileLink>;
  download(companyId: string, payslipId: string, token: string): Promise<PayslipFileLink>;
  export(
    companyId: string,
    criteria: PayslipListCriteria,
    token: string,
  ): Promise<PayslipFileLink[]>;
}

export const IPayslipGateway = Symbol('IPayslipGateway');
