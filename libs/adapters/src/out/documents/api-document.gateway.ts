import {
  DocumentDeposit,
  DocumentFileLink,
  DocumentList,
  DocumentListCriteria,
  DocumentSummary,
  documentFileFormatSpec,
} from '@hexagonal-monorepo-template/domain';
import {
  ApiResponse,
  buildUrl,
  unwrapResponse,
} from '@hexagonal-monorepo-template/infrastructure';
import {
  API_ROUTES,
  companyPath,
  IDocumentGateway,
  IHttpClient,
  MultipartBody,
} from '@hexagonal-monorepo-template/ports';

type ListQueryParams = Record<string, string | undefined>;

export class ApiDocumentGateway implements IDocumentGateway {
  constructor(private readonly httpClient: IHttpClient) {}

  async list(
    companyId: string,
    criteria: DocumentListCriteria,
    token: string,
  ): Promise<DocumentList> {
    return unwrapResponse(
      await this.httpClient.get<ApiResponse<DocumentList>>(
        buildUrl(
          companyPath(API_ROUTES.companies.documents, { companyId }),
          this.toQueryParams(criteria),
        ),
        this.authorized(token),
      ),
    );
  }

  async deposit(
    companyId: string,
    deposit: DocumentDeposit,
    token: string,
  ): Promise<DocumentSummary[]> {
    return unwrapResponse(
      await this.httpClient.postMultipart<ApiResponse<DocumentSummary[]>>(
        companyPath(API_ROUTES.companies.documents, { companyId }),
        this.toMultipart(deposit),
        this.authorized(token),
      ),
    );
  }

  async view(
    companyId: string,
    documentId: string,
    token: string,
  ): Promise<DocumentFileLink> {
    return unwrapResponse(
      await this.httpClient.post<ApiResponse<DocumentFileLink>>(
        companyPath(API_ROUTES.companies.documentView, { companyId, documentId }),
        undefined,
        this.authorized(token),
      ),
    );
  }

  async download(
    companyId: string,
    documentId: string,
    token: string,
  ): Promise<DocumentFileLink> {
    return unwrapResponse(
      await this.httpClient.get<ApiResponse<DocumentFileLink>>(
        companyPath(API_ROUTES.companies.documentDownload, {
          companyId,
          documentId,
        }),
        this.authorized(token),
      ),
    );
  }

  private toQueryParams(criteria: DocumentListCriteria): ListQueryParams {
    return {
      search: this.optional(criteria.search.trim()),
      searchCategories: this.joined(criteria.searchCategories),
      searchEmitters: this.joined(criteria.searchEmitters),
      categories: this.joined(criteria.categories),
      statuses: this.joined(criteria.statuses),
      emitters: this.joined(criteria.emitters),
      from: criteria.from ?? undefined,
      to: criteria.to ?? undefined,
      sort: criteria.sort,
    };
  }

  private toMultipart(deposit: DocumentDeposit): MultipartBody {
    return {
      fields: [
        { name: 'category', value: deposit.category },
        ...(deposit.comment === null
          ? []
          : [{ name: 'comment', value: deposit.comment.value }]),
        ...deposit.files.map((file) => ({ name: 'names', value: file.name.value })),
      ],
      files: deposit.files.map((file) => ({
        field: 'files',
        fileName: file.fileName,
        contentType: documentFileFormatSpec(file.format).mimeType,
        content: file.content,
      })),
    };
  }

  private joined(values: readonly string[]): string | undefined {
    return values.length === 0 ? undefined : values.join(',');
  }

  private optional(value: string): string | undefined {
    return value === '' ? undefined : value;
  }

  private authorized(token: string): { headers: { Authorization: string } } {
    return { headers: { Authorization: `Bearer ${token}` } };
  }
}
