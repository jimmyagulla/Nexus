import {
  ActorContext,
  PayslipList,
  PayslipListCriteria,
} from '@hexagonal-monorepo-template/domain';

export interface IListPayslips {
  execute(input: {
    actor: ActorContext;
    criteria: PayslipListCriteria;
  }): Promise<PayslipList>;
}

export const IListPayslips = Symbol('IListPayslips');
