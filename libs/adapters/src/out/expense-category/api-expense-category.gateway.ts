import { ExpenseCategorySnapshot } from '@hexagonal-monorepo-template/domain';
import {
  ApiResponse,
  unwrapResponse,
} from '@hexagonal-monorepo-template/infrastructure';
import {
  API_ROUTES,
  companyPath,
  IExpenseCategoryGateway,
  IHttpClient,
} from '@hexagonal-monorepo-template/ports';

export class ApiExpenseCategoryGateway implements IExpenseCategoryGateway {
  constructor(private readonly httpClient: IHttpClient) {}

  async list(
    companyId: string,
    token: string,
  ): Promise<readonly ExpenseCategorySnapshot[]> {
    return unwrapResponse(
      await this.httpClient.get<ApiResponse<ExpenseCategorySnapshot[]>>(
        this.path(companyId),
        this.authorized(token),
      ),
    );
  }

  async add(
    companyId: string,
    label: string,
    token: string,
  ): Promise<readonly ExpenseCategorySnapshot[]> {
    return unwrapResponse(
      await this.httpClient.post<ApiResponse<ExpenseCategorySnapshot[]>>(
        this.path(companyId),
        { label },
        this.authorized(token),
      ),
    );
  }

  private path(companyId: string): string {
    return companyPath(API_ROUTES.companies.expenseCategories, { companyId });
  }

  private authorized(token: string): { headers: { Authorization: string } } {
    return { headers: { Authorization: `Bearer ${token}` } };
  }
}
