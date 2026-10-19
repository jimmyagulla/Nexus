import {
  PayslipList,
  PayslipListCriteria,
} from '@hexagonal-monorepo-template/domain';
import {
  IListPayslipsFromSession,
  IPayslipGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

export class ListPayslipsFromSessionUseCase implements IListPayslipsFromSession {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly payslips: IPayslipGateway,
  ) {}

  async execute(criteria: PayslipListCriteria): Promise<PayslipList> {
    const session = await currentCompanySession(this.sessions);
    return this.payslips.list(session.companyId, criteria, session.token);
  }
}
