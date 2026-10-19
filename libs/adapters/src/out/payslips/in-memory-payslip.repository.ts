import {
  comparePayslips,
  matchesPayslipListCriteria,
  OwnerScope,
  Payslip,
  PayslipList,
  PayslipListCriteria,
  toPayslipList,
} from '@hexagonal-monorepo-template/domain';
import { IPayslipRepository } from '@hexagonal-monorepo-template/ports';

export class InMemoryPayslipRepository implements IPayslipRepository {
  constructor(private readonly payslips = new Map<string, Payslip>()) {}

  async findById(payslipId: string): Promise<Payslip | null> {
    return this.payslips.get(payslipId) ?? null;
  }

  async list(scope: OwnerScope, criteria: PayslipListCriteria): Promise<PayslipList> {
    return toPayslipList(this.ownedBy(scope), criteria);
  }

  async findAll(scope: OwnerScope, criteria: PayslipListCriteria): Promise<Payslip[]> {
    return this.ownedBy(scope)
      .filter((payslip) => matchesPayslipListCriteria(payslip, criteria))
      .sort(comparePayslips);
  }

  private ownedBy(scope: OwnerScope): Payslip[] {
    return [...this.payslips.values()].filter((payslip) =>
      payslip.isOwnedBy(scope.companyId, scope.ownerId),
    );
  }
}
