import { CompanySettingsSnapshot } from '@hexagonal-monorepo-template/domain';
import {
  IAddCompanyPublicHolidayFromSession,
  ICompanyPublicHolidaysGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

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
    const session = await currentCompanySession(this.sessions);
    return this.publicHolidays.add(
      session.companyId,
      input.date,
      input.label,
      session.token,
    );
  }
}
