import {
  documentFileFormatSpec,
  ExpenseReportDetails,
  ExpenseReportDraft,
  ExpenseReportList,
  ExpenseReportListCriteria,
  ExpenseReportProofLink,
  ExpenseReportRevisionDraft,
  ExpenseReportSummary,
  PreparedExpenseReportProof,
} from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  companyPath,
  IExpenseReportGateway,
  IHttpClient,
  MultipartBody,
} from '@hexagonal-monorepo-template/ports';
import { buildUrl } from '../../infrastructure/network/build-url';
import {
  ApiResponse,
  unwrapResponse,
} from '../../infrastructure/network/unwrap-response';
import { authorizedBy, joinedParam, optionalParam } from './gateway-request';

type ListQueryParams = Record<string, string | readonly string[] | undefined>;
type FormField = { name: string; value: string };

export class ApiExpenseReportGateway implements IExpenseReportGateway {
  constructor(private readonly httpClient: IHttpClient) {}

  async list(
    companyId: string,
    criteria: ExpenseReportListCriteria,
    token: string,
  ): Promise<ExpenseReportList> {
    return unwrapResponse(
      await this.httpClient.get<ApiResponse<ExpenseReportList>>(
        buildUrl(
          companyPath(API_ROUTES.companies.expenseReports, { companyId }),
          this.toQueryParams(criteria),
        ),
        authorizedBy(token),
      ),
    );
  }

  async submit(
    companyId: string,
    draft: ExpenseReportDraft,
    token: string,
  ): Promise<ExpenseReportSummary> {
    return unwrapResponse(
      await this.httpClient.postMultipart<ApiResponse<ExpenseReportSummary>>(
        companyPath(API_ROUTES.companies.expenseReports, { companyId }),
        this.toMultipart(this.detailFields(draft.details), draft.proof),
        authorizedBy(token),
      ),
    );
  }

  async revise(
    companyId: string,
    expenseReportId: string,
    draft: ExpenseReportRevisionDraft,
    token: string,
  ): Promise<ExpenseReportSummary> {
    return unwrapResponse(
      await this.httpClient.putMultipart<ApiResponse<ExpenseReportSummary>>(
        companyPath(API_ROUTES.companies.expenseReport, { companyId, expenseReportId }),
        this.toMultipart(
          [...this.detailFields(draft.details), { name: 'keepProof', value: String(draft.keepProof) }],
          draft.proof,
        ),
        authorizedBy(token),
      ),
    );
  }

  async viewProof(
    companyId: string,
    expenseReportId: string,
    token: string,
  ): Promise<ExpenseReportProofLink> {
    return unwrapResponse(
      await this.httpClient.get<ApiResponse<ExpenseReportProofLink>>(
        companyPath(API_ROUTES.companies.expenseReportProof, { companyId, expenseReportId }),
        authorizedBy(token),
      ),
    );
  }

  private toQueryParams(criteria: ExpenseReportListCriteria): ListQueryParams {
    return {
      search: optionalParam(criteria.search.trim()),
      searchCategories: joinedParam(criteria.searchCategories),
      categories: joinedParam(criteria.categories),
      statuses: joinedParam(criteria.statuses),
      // A project may hold a comma: one parameter per project.
      projects: criteria.projects,
      proofs: joinedParam(criteria.proofs),
      from: criteria.from ?? undefined,
      to: criteria.to ?? undefined,
      minAmount: criteria.minAmount ?? undefined,
      maxAmount: criteria.maxAmount ?? undefined,
      sort: criteria.sort,
      direction: criteria.direction,
    };
  }

  private detailFields(details: ExpenseReportDetails): FormField[] {
    return [
      { name: 'date', value: details.date.value },
      { name: 'category', value: details.category },
      { name: 'paymentMethod', value: details.paymentMethod },
      { name: 'amount', value: details.amount.value },
      ...(details.vat === null ? [] : [{ name: 'vatRate', value: String(details.vat.rate) }]),
      { name: 'description', value: details.description.value },
      ...(details.project === null ? [] : [{ name: 'project', value: details.project.value }]),
    ];
  }

  private toMultipart(
    fields: readonly FormField[],
    proof: PreparedExpenseReportProof | null,
  ): MultipartBody {
    return {
      fields,
      files:
        proof === null
          ? []
          : [
              {
                field: 'proof',
                fileName: proof.fileName,
                contentType: documentFileFormatSpec(proof.format).mimeType,
                content: proof.content,
              },
            ],
    };
  }
}
