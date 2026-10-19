import {
  PayslipFileLink,
  PayslipListCriteria,
} from '@hexagonal-monorepo-template/domain';
import {
  IExportPayslipsFromSession,
  IPayslipGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

export class ExportPayslipsFromSessionUseCase
  implements IExportPayslipsFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly payslips: IPayslipGateway,
  ) {}

  async execute(criteria: PayslipListCriteria): Promise<PayslipFileLink[]> {
    const session = await currentCompanySession(this.sessions);
    return this.payslips.export(session.companyId, criteria, session.token);
  }
}
