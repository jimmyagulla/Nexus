import {
  PayslipList,
  PayslipListCriteria,
} from '@hexagonal-monorepo-template/domain';

export interface IListPayslipsFromSession {
  execute(criteria: PayslipListCriteria): Promise<PayslipList>;
}

export const IListPayslipsFromSession = Symbol('IListPayslipsFromSession');
