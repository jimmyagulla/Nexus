import { CompanySettingsSnapshot, DayOfWeek } from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  companyPath,
  ICompanySettingsGateway,
  IHttpClient,
} from '@hexagonal-monorepo-template/ports';

export class ApiCompanySettingsGateway implements ICompanySettingsGateway {
  constructor(private readonly http: IHttpClient) {}

  get(companyId: string, token: string): Promise<CompanySettingsSnapshot> {
    return this.http.request({
      method: 'GET',
      path: companyPath(API_ROUTES.companies.settings, { companyId }),
      token,
    });
  }

  rename(
    companyId: string,
    name: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    return this.http.request({
      method: 'PATCH',
      path: companyPath(API_ROUTES.companies.name, { companyId }),
      body: { name },
      token,
    });
  }

  setNonWorkingWeekdays(
    companyId: string,
    weekdays: readonly DayOfWeek[],
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    return this.http.request({
      method: 'PUT',
      path: companyPath(API_ROUTES.companies.nonWorkingWeekdays, { companyId }),
      body: { weekdays },
      token,
    });
  }
}
