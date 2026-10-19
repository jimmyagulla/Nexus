import {
  PayslipFileLink,
  PayslipList,
  PayslipListCriteria,
} from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  companyPath,
  IHttpClient,
  IPayslipGateway,
} from '@hexagonal-monorepo-template/ports';
import { buildUrl } from '../../infrastructure/network/build-url';
import {
  ApiResponse,
  unwrapResponse,
} from '../../infrastructure/network/unwrap-response';
import { authorizedBy } from './gateway-request';

type ListQueryParams = Record<string, number | undefined>;

export class ApiPayslipGateway implements IPayslipGateway {
  constructor(private readonly httpClient: IHttpClient) {}

  async list(
    companyId: string,
    criteria: PayslipListCriteria,
    token: string,
  ): Promise<PayslipList> {
    return unwrapResponse(
      await this.httpClient.get<ApiResponse<PayslipList>>(
        buildUrl(
          companyPath(API_ROUTES.companies.payslips, { companyId }),
          this.toQueryParams(criteria),
        ),
        authorizedBy(token),
      ),
    );
  }

  async view(
    companyId: string,
    payslipId: string,
    token: string,
  ): Promise<PayslipFileLink> {
    return unwrapResponse(
      await this.httpClient.get<ApiResponse<PayslipFileLink>>(
        companyPath(API_ROUTES.companies.payslipView, { companyId, payslipId }),
        authorizedBy(token),
      ),
    );
  }

  async download(
    companyId: string,
    payslipId: string,
    token: string,
  ): Promise<PayslipFileLink> {
    return unwrapResponse(
      await this.httpClient.get<ApiResponse<PayslipFileLink>>(
        companyPath(API_ROUTES.companies.payslipDownload, { companyId, payslipId }),
        authorizedBy(token),
      ),
    );
  }

  async export(
    companyId: string,
    criteria: PayslipListCriteria,
    token: string,
  ): Promise<PayslipFileLink[]> {
    return unwrapResponse(
      await this.httpClient.get<ApiResponse<PayslipFileLink[]>>(
        buildUrl(
          companyPath(API_ROUTES.companies.payslipExport, { companyId }),
          this.toQueryParams(criteria),
        ),
        authorizedBy(token),
      ),
    );
  }

  /** Every year: no year in the query string. */
  private toQueryParams(criteria: PayslipListCriteria): ListQueryParams {
    return { year: criteria.year ?? undefined };
  }
}
