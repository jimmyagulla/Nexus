import {
  OwnerScope,
  Payslip,
  PayslipList,
  PayslipListCriteria,
} from '@hexagonal-monorepo-template/domain';

export interface IPayslipRepository {
  findById(payslipId: string): Promise<Payslip | null>;
  /** Summaries of the employee's payslips, January to December. */
  list(scope: OwnerScope, criteria: PayslipListCriteria): Promise<PayslipList>;
  /** The payslips themselves, to reach their files. */
  findAll(scope: OwnerScope, criteria: PayslipListCriteria): Promise<Payslip[]>;
}

export const IPayslipRepository = Symbol('IPayslipRepository');
