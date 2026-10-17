import { CompanySettingsSnapshot } from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  companyPath,
  ICompanyPublicHolidaysGateway,
  IHttpClient,
} from '@hexagonal-monorepo-template/ports';
import {
  ApiResponse,
  unwrapResponse,
} from '../../infrastructure/network/unwrap-response';
import {
  CompanySettingsPayload,
  toCompanySettingsSnapshot,
} from './company-settings.payload';
import { authorizedBy } from './gateway-request';

export class ApiCompanyPublicHolidaysGateway
  implements ICompanyPublicHolidaysGateway
{
  constructor(private readonly httpClient: IHttpClient) {}

  async add(
    companyId: string,
    date: string,
    label: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    const payload = unwrapResponse(
      await this.httpClient.post<ApiResponse<CompanySettingsPayload>>(
        companyPath(API_ROUTES.companies.publicHolidays, { companyId }),
        { date, label },
        authorizedBy(token),
      ),
    );
    return toCompanySettingsSnapshot(payload);
  }

  async update(
    companyId: string,
    publicHolidayId: string,
    date: string,
    label: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    const payload = unwrapResponse(
      await this.httpClient.patch<ApiResponse<CompanySettingsPayload>>(
        this.holidayPath(companyId, publicHolidayId),
        { date, label },
        authorizedBy(token),
      ),
    );
    return toCompanySettingsSnapshot(payload);
  }

  async remove(
    companyId: string,
    publicHolidayId: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    const payload = unwrapResponse(
      await this.httpClient.delete<ApiResponse<CompanySettingsPayload>>(
        this.holidayPath(companyId, publicHolidayId),
        authorizedBy(token),
      ),
    );
    return toCompanySettingsSnapshot(payload);
  }

  private holidayPath(companyId: string, publicHolidayId: string): string {
    return companyPath(API_ROUTES.companies.publicHoliday, {
      companyId,
      publicHolidayId,
    });
  }
}
