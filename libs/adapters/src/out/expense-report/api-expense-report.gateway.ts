import {
  ExpenseDetailsInput,
  ExpenseReportListSnapshot,
  ExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  ApiResponse,
  unwrapResponse,
} from '@hexagonal-monorepo-template/infrastructure';
import {
  API_ROUTES,
  companyPath,
  IExpenseReportGateway,
  IHttpClient,
} from '@hexagonal-monorepo-template/ports';

export class ApiExpenseReportGateway implements IExpenseReportGateway {
  constructor(private readonly httpClient: IHttpClient) {}

  async create(
    companyId: string,
    label: string,
    token: string,
  ): Promise<ExpenseReportSnapshot> {
    return unwrapResponse(
      await this.httpClient.post<ApiResponse<ExpenseReportSnapshot>>(
        companyPath(API_ROUTES.companies.expenseReports, { companyId }),
        { label },
        this.authorized(token),
      ),
    );
  }

  async get(
    companyId: string,
    reportId: string,
    token: string,
  ): Promise<ExpenseReportSnapshot> {
    return unwrapResponse(
      await this.httpClient.get<ApiResponse<ExpenseReportSnapshot>>(
        this.reportPath(companyId, reportId),
        this.authorized(token),
      ),
    );
  }

  async list(
    companyId: string,
    token: string,
  ): Promise<ExpenseReportListSnapshot> {
    return unwrapResponse(
      await this.httpClient.get<ApiResponse<ExpenseReportListSnapshot>>(
        companyPath(API_ROUTES.companies.expenseReports, { companyId }),
        this.authorized(token),
      ),
    );
  }

  async addExpense(
    companyId: string,
    reportId: string,
    expense: ExpenseDetailsInput,
    token: string,
  ): Promise<ExpenseReportSnapshot> {
    return unwrapResponse(
      await this.httpClient.post<ApiResponse<ExpenseReportSnapshot>>(
        companyPath(API_ROUTES.companies.expenseReportExpenses, {
          companyId,
          expenseReportId: reportId,
        }),
        expense,
        this.authorized(token),
      ),
    );
  }

  async updateExpense(
    companyId: string,
    reportId: string,
    expenseId: string,
    expense: ExpenseDetailsInput,
    token: string,
  ): Promise<ExpenseReportSnapshot> {
    return unwrapResponse(
      await this.httpClient.patch<ApiResponse<ExpenseReportSnapshot>>(
        this.expensePath(companyId, reportId, expenseId),
        expense,
        this.authorized(token),
      ),
    );
  }

  async removeExpense(
    companyId: string,
    reportId: string,
    expenseId: string,
    token: string,
  ): Promise<ExpenseReportSnapshot> {
    return unwrapResponse(
      await this.httpClient.delete<ApiResponse<ExpenseReportSnapshot>>(
        this.expensePath(companyId, reportId, expenseId),
        this.authorized(token),
      ),
    );
  }

  private expensePath(
    companyId: string,
    reportId: string,
    expenseId: string,
  ): string {
    return companyPath(API_ROUTES.companies.expenseReportExpense, {
      companyId,
      expenseReportId: reportId,
      expenseId,
    });
  }

  private reportPath(companyId: string, reportId: string): string {
    return companyPath(API_ROUTES.companies.expenseReport, {
      companyId,
      expenseReportId: reportId,
    });
  }

  private authorized(token: string): { headers: { Authorization: string } } {
    return { headers: { Authorization: `Bearer ${token}` } };
  }
}
