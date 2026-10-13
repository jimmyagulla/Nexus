import {
  SecondFactorChallenge,
  SecondFactorEnrollment,
  SecondFactorEnrollmentConfirmation,
  SecondFactorStatus,
  SecondFactorVerification,
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

  async getStatus(token: string): Promise<SecondFactorStatus> {
    const payload = unwrapResponse(
      await this.httpClient.get<ApiResponse<SecondFactorStatus>>(
        secondFactorPath(API_ROUTES.secondFactor.status),
        this.authorized(token),
      ),
    );
    return { step: payload.step };
  }

  async openChallenge(token: string): Promise<SecondFactorChallenge> {
    const payload = unwrapResponse(
      await this.httpClient.post<ApiResponse<SecondFactorChallenge>>(
        secondFactorPath(API_ROUTES.secondFactor.challenge),
        undefined,
        this.authorized(token),
      ),
    );
    return { step: payload.step };
  }

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

  async verify(
    code: string,
    token: string,
  ): Promise<SecondFactorVerification> {
    unwrapResponse(
      await this.httpClient.post<ApiResponse<SecondFactorVerification>>(
        secondFactorPath(API_ROUTES.secondFactor.verification),
        { code },
        this.authorized(token),
      ),
    );
    return { verified: true };
  }

  private authorized(token: string): { headers: { Authorization: string } } {
    return { headers: { Authorization: `Bearer ${token}` } };
  }
}
