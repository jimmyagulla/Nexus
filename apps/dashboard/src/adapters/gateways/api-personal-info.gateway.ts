import {
  PersonalContactValues,
  PersonalInfoSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  companyPath,
  IHttpClient,
  IPersonalInfoGateway,
} from '@hexagonal-monorepo-template/ports';
import {
  ApiResponse,
  unwrapResponse,
} from '../../infrastructure/network/unwrap-response';
import { authorizedBy } from './gateway-request';

export class ApiPersonalInfoGateway implements IPersonalInfoGateway {
  constructor(private readonly httpClient: IHttpClient) {}

  async get(
    companyId: string,
    employeeId: string,
    token: string,
  ): Promise<PersonalInfoSnapshot> {
    return unwrapResponse(
      await this.httpClient.get<ApiResponse<PersonalInfoSnapshot>>(
        this.pathOf(companyId, employeeId),
        authorizedBy(token),
      ),
    );
  }

  async updateContact(
    companyId: string,
    employeeId: string,
    contact: PersonalContactValues,
    token: string,
  ): Promise<PersonalInfoSnapshot> {
    return unwrapResponse(
      await this.httpClient.patch<ApiResponse<PersonalInfoSnapshot>>(
        this.pathOf(companyId, employeeId),
        contact,
        authorizedBy(token),
      ),
    );
  }

  private pathOf(companyId: string, employeeId: string): string {
    return companyPath(API_ROUTES.companies.employeePersonalInfo, { companyId, employeeId });
  }
}
