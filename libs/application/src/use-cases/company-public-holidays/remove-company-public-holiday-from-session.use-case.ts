import {
  CompanyScopedSession,
  CompanySettingsSnapshot,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  ICompanyPublicHolidaysGateway,
  IRemoveCompanyPublicHolidayFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class RemoveCompanyPublicHolidayFromSessionUseCase
  implements IRemoveCompanyPublicHolidayFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly publicHolidays: ICompanyPublicHolidaysGateway,
  ) {}

  async execute(publicHolidayId: string): Promise<CompanySettingsSnapshot> {
    const session = await this.currentCompanySession();
    return this.publicHolidays.remove(
      session.companyId,
      publicHolidayId,
      session.token,
    );
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
