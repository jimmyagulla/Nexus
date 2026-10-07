import {
  CompanyScopedSession,
  CompanySettingsSnapshot,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  ICompanySettingsGateway,
  IGetCompanySettingsFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class GetCompanySettingsFromSessionUseCase
  implements IGetCompanySettingsFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly companySettings: ICompanySettingsGateway,
  ) {}

  async execute(): Promise<CompanySettingsSnapshot> {
    const session = await this.currentCompanySession();
    return this.companySettings.get(session.companyId, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
