import {
  AccountSummary,
  InvitedAccount,
  SignedInSession,
} from '@hexagonal-monorepo-template/domain';
import {
  ApiResponse,
  unwrapResponse,
} from '@hexagonal-monorepo-template/infrastructure';
import {
  API_ROUTES,
  companyPath,
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

  async listByCompany(
    companyId: string,
    token: string,
  ): Promise<readonly AccountSummary[]> {
    return unwrapResponse(
      await this.httpClient.get<ApiResponse<AccountSummary[]>>(
        companyPath(API_ROUTES.companies.accounts, { companyId }),
        this.authorized(token),
      ),
    );
  }

  async invite(
    companyId: string,
    identifier: string,
    token: string,
  ): Promise<InvitedAccount> {
    return unwrapResponse(
      await this.httpClient.post<ApiResponse<InvitedAccount>>(
        companyPath(API_ROUTES.companies.accounts, { companyId }),
        { identifier },
        this.authorized(token),
      ),
    );
  }

  async disable(
    companyId: string,
    accountId: string,
    token: string,
  ): Promise<AccountSummary> {
    return unwrapResponse(
      await this.httpClient.post<ApiResponse<AccountSummary>>(
        companyPath(API_ROUTES.companies.accountDisable, {
          companyId,
          accountId,
        }),
        undefined,
        this.authorized(token),
      ),
    );
  }

  async restore(
    companyId: string,
    accountId: string,
    token: string,
  ): Promise<AccountSummary> {
    return unwrapResponse(
      await this.httpClient.post<ApiResponse<AccountSummary>>(
        companyPath(API_ROUTES.companies.accountRestore, {
          companyId,
          accountId,
        }),
        undefined,
        this.authorized(token),
      ),
    );
  }

  private authorized(token: string): { headers: { Authorization: string } } {
    return { headers: { Authorization: `Bearer ${token}` } };
  }
}
