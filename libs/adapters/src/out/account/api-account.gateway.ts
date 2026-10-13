import { SignedInSession } from '@hexagonal-monorepo-template/domain';
import {
  ApiResponse,
  unwrapResponse,
} from '@hexagonal-monorepo-template/infrastructure';
import {
  API_ROUTES,
  IAccountGateway,
  IHttpClient,
} from '@hexagonal-monorepo-template/ports';

export class ApiAccountGateway implements IAccountGateway {
  constructor(private readonly httpClient: IHttpClient) {}

  async activate(input: {
    invitationToken: string;
    secret: string;
  }): Promise<void> {
    unwrapResponse(
      await this.httpClient.post(
        `${API_ROUTES.accounts.base}/${API_ROUTES.accounts.activation}`,
        input,
      ),
    );
  }

  async activateEmployee(input: {
    invitationToken: string;
    secret: string;
  }): Promise<void> {
    unwrapResponse(
      await this.httpClient.post(
        `${API_ROUTES.accounts.base}/${API_ROUTES.accounts.employeeActivation}`,
        input,
      ),
    );
  }

  async signIn(input: {
    identifier: string;
    secret: string;
  }): Promise<SignedInSession> {
    return unwrapResponse(
      await this.httpClient.post<ApiResponse<SignedInSession>>(
        `${API_ROUTES.accounts.base}/${API_ROUTES.accounts.signIn}`,
        input,
      ),
    );
  }
}
