import { unwrapResponse } from '@hexagonal-monorepo-template/infrastructure';
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
}
