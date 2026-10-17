import { CompanySettingsSnapshot } from '@hexagonal-monorepo-template/domain';
import {
  ICompanyPublicHolidaysGateway,
  IRemoveCompanyPublicHolidayFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

export class RemoveCompanyPublicHolidayFromSessionUseCase
  implements IRemoveCompanyPublicHolidayFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly publicHolidays: ICompanyPublicHolidaysGateway,
  ) {}

  async execute(publicHolidayId: string): Promise<CompanySettingsSnapshot> {
    const session = await currentCompanySession(this.sessions);
    return this.publicHolidays.remove(
      session.companyId,
      publicHolidayId,
      session.token,
    );
  }
}
