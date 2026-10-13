import { OpenedEmployeeWorkspace } from '@hexagonal-monorepo-template/domain';
import {
  ApiResponse,
  unwrapResponse,
} from '@hexagonal-monorepo-template/infrastructure';
import {
  API_ROUTES,
  IHttpClient,
  ISecondFactorEnrollmentGateway,
} from '@hexagonal-monorepo-template/ports';

export class ApiSecondFactorEnrollmentGateway
  implements ISecondFactorEnrollmentGateway
{
  constructor(private readonly httpClient: IHttpClient) {}

  async confirm(input: {
    enrollmentId: string;
    code: string;
  }): Promise<OpenedEmployeeWorkspace> {
    return unwrapResponse(
      await this.httpClient.post<ApiResponse<OpenedEmployeeWorkspace>>(
        `${API_ROUTES.secondFactor.base}/${API_ROUTES.secondFactor.enrollmentConfirmation}`,
        input,
      ),
    );
  }
}
