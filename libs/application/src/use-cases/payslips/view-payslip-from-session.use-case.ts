import { PayslipFileLink } from '@hexagonal-monorepo-template/domain';
import {
  IPayslipGateway,
  ISessionGateway,
  IViewPayslipFromSession,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

export class ViewPayslipFromSessionUseCase implements IViewPayslipFromSession {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly payslips: IPayslipGateway,
  ) {}

  async execute(payslipId: string): Promise<PayslipFileLink> {
    const session = await currentCompanySession(this.sessions);
    return this.payslips.view(session.companyId, payslipId, session.token);
  }
}
