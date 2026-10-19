import {
  ActorContext,
  PayslipList,
  PayslipListCriteria,
  requireOwnerScope,
} from '@hexagonal-monorepo-template/domain';
import {
  IListPayslips,
  IPayslipRepository,
} from '@hexagonal-monorepo-template/ports';

export class ListPayslipsUseCase implements IListPayslips {
  constructor(private readonly payslips: IPayslipRepository) {}

  async execute(input: {
    actor: ActorContext;
    criteria: PayslipListCriteria;
  }): Promise<PayslipList> {
    return this.payslips.list(requireOwnerScope(input.actor), input.criteria);
  }
}
