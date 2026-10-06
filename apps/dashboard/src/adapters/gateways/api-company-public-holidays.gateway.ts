import { CompanySettingsSnapshot } from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  companyPath,
  ICompanyPublicHolidaysGateway,
  IHttpClient,
} from '@hexagonal-monorepo-template/ports';

export class ApiCompanyPublicHolidaysGateway
  implements ICompanyPublicHolidaysGateway
{
  constructor(private readonly http: IHttpClient) {}

  add(
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

  update(
    companyId: string,
    publicHolidayId: string,
    date: string,
    label: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    return this.http.request({
      method: 'PATCH',
      path: this.holidayPath(companyId, publicHolidayId),
      body: { date, label },
      token,
    });
  }

  remove(
    companyId: string,
    publicHolidayId: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    return this.http.request({
      method: 'DELETE',
      path: this.holidayPath(companyId, publicHolidayId),
      token,
    });
  }

  private holidayPath(companyId: string, publicHolidayId: string): string {
    return companyPath(API_ROUTES.companies.publicHoliday, {
      companyId,
      publicHolidayId,
    });
  }
}
