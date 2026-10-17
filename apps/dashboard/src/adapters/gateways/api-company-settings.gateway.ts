import {
  CompanySettingsSnapshot,
  DayOfWeek,
} from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  companyPath,
  ICompanySettingsGateway,
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

export class ApiCompanySettingsGateway implements ICompanySettingsGateway {
  constructor(private readonly httpClient: IHttpClient) {}

  async get(
    companyId: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    const payload = unwrapResponse(
      await this.httpClient.get<ApiResponse<CompanySettingsPayload>>(
        companyPath(API_ROUTES.companies.settings, { companyId }),
        authorizedBy(token),
      ),
    );
    return toCompanySettingsSnapshot(payload);
  }

  async rename(
    companyId: string,
    name: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    const payload = unwrapResponse(
      await this.httpClient.patch<ApiResponse<CompanySettingsPayload>>(
        companyPath(API_ROUTES.companies.name, { companyId }),
        { name },
        authorizedBy(token),
      ),
    );
    return toCompanySettingsSnapshot(payload);
  }

  async setNonWorkingWeekdays(
    companyId: string,
    weekdays: readonly DayOfWeek[],
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    const payload = unwrapResponse(
      await this.httpClient.put<ApiResponse<CompanySettingsPayload>>(
        companyPath(API_ROUTES.companies.nonWorkingWeekdays, { companyId }),
        { weekdays },
        authorizedBy(token),
      ),
    );
    return toCompanySettingsSnapshot(payload);
  }
}
