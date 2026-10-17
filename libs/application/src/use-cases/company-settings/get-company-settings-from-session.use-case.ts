import { CompanySettingsSnapshot } from '@hexagonal-monorepo-template/domain';
import {
  ICompanySettingsGateway,
  IGetCompanySettingsFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

export class GetCompanySettingsFromSessionUseCase
  implements IGetCompanySettingsFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly companySettings: ICompanySettingsGateway,
  ) {}

  async execute(): Promise<CompanySettingsSnapshot> {
    const session = await currentCompanySession(this.sessions);
    return this.companySettings.get(session.companyId, session.token);
  }
}
