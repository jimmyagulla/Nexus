import {
  CompanyScopedSession,
  CompanySettingsSnapshot,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IAddCompanyPublicHolidayFromSession,
  ICompanyPublicHolidaysGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class AddCompanyPublicHolidayFromSessionUseCase
  implements IAddCompanyPublicHolidayFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly publicHolidays: ICompanyPublicHolidaysGateway,
  ) {}

  async execute(input: {
    date: string;
    label: string;
  }): Promise<CompanySettingsSnapshot> {
    const session = await this.currentCompanySession();
    return this.publicHolidays.add(
      session.companyId,
      input.date,
      input.label,
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
