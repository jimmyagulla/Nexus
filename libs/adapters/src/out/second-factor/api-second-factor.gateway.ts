import {
  SecondFactorEnrollment,
  SecondFactorEnrollmentConfirmation,
} from '@hexagonal-monorepo-template/domain';
import {
  ApiResponse,
  unwrapResponse,
} from '@hexagonal-monorepo-template/infrastructure';
import {
  API_ROUTES,
  IHttpClient,
  ISecondFactorGateway,
  secondFactorPath,
} from '@hexagonal-monorepo-template/ports';

export class ApiSecondFactorGateway implements ISecondFactorGateway {
  constructor(private readonly httpClient: IHttpClient) {}

  async beginEnrollment(token: string): Promise<SecondFactorEnrollment> {
    const payload = unwrapResponse(
      await this.httpClient.post<ApiResponse<SecondFactorEnrollment>>(
        secondFactorPath(API_ROUTES.secondFactor.enrollment),
        undefined,
        this.authorized(token),
      ),
    );
    return {
      secret: payload.secret,
      provisioningUri: payload.provisioningUri,
    };
  }

  async confirmEnrollment(
    code: string,
    token: string,
  ): Promise<SecondFactorEnrollmentConfirmation> {
    const payload = unwrapResponse(
      await this.httpClient.post<
        ApiResponse<SecondFactorEnrollmentConfirmation>
      >(
        secondFactorPath(API_ROUTES.secondFactor.enrollmentConfirmation),
        { code },
        this.authorized(token),
      ),
    );
    return { enrolled: true, recoveryCodes: [...payload.recoveryCodes] };
  }

  private authorized(token: string): { headers: { Authorization: string } } {
    return { headers: { Authorization: `Bearer ${token}` } };
  }
}
