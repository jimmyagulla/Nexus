import { PayslipFileLink } from '@hexagonal-monorepo-template/domain';
import {
  IDownloadPayslipFromSession,
  IPayslipGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

export class DownloadPayslipFromSessionUseCase
  implements IDownloadPayslipFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly payslips: IPayslipGateway,
  ) {}

  async execute(payslipId: string): Promise<PayslipFileLink> {
    const session = await currentCompanySession(this.sessions);
    return this.payslips.download(session.companyId, payslipId, session.token);
  }
}
