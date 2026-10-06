import {
  API_ROUTES,
  companyPath,
  IHttpClient,
} from '@hexagonal-monorepo-template/ports';
import { CompanySettingsSnapshot } from '@hexagonal-monorepo-template/domain';
import { ICompanySettingsGateway } from '../../domain/company-settings.gateway';

export class ApiCompanySettingsGateway implements ICompanySettingsGateway {
  constructor(private readonly http: IHttpClient) {}

  create(name: string, token: string): Promise<CompanySettingsSnapshot> {
    return this.http.request({
      method: 'POST',
      path: API_ROUTES.companies.base,
      body: { name },
      token,
    });
  }

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
    weekdays: readonly string[],
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    return this.http.request({
      method: 'PUT',
      path: companyPath(API_ROUTES.companies.nonWorkingWeekdays, { companyId }),
      body: { weekdays },
      token,
    });
  }

  addPublicHoliday(
    companyId: string,
    date: string,
    label: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    return this.http.request({
      method: 'POST',
      path: companyPath(API_ROUTES.companies.publicHolidays, { companyId }),
      body: { date, label },
      token,
    });
  }

  updatePublicHoliday(
    companyId: string,
    publicHolidayId: string,
    date: string,
    label: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    return this.http.request({
      method: 'PATCH',
      path: companyPath(API_ROUTES.companies.publicHoliday, {
        companyId,
        publicHolidayId,
      }),
      body: { date, label },
      token,
    });
  }

  removePublicHoliday(
    companyId: string,
    publicHolidayId: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    return this.http.request({
      method: 'DELETE',
      path: companyPath(API_ROUTES.companies.publicHoliday, {
        companyId,
        publicHolidayId,
      }),
      token,
    });
  }
}
