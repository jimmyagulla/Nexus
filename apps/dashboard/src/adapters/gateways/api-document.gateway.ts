import {
  DocumentDeposit,
  DocumentFileLink,
  DocumentList,
  DocumentListCriteria,
  DocumentSummary,
  documentFileFormatSpec,
} from '@hexagonal-monorepo-template/domain';
import {
  API_ROUTES,
  companyPath,
  IDocumentGateway,
  IHttpClient,
  MultipartBody,
} from '@hexagonal-monorepo-template/ports';
import { buildUrl } from '../../infrastructure/network/build-url';
import {
  ApiResponse,
  unwrapResponse,
} from '../../infrastructure/network/unwrap-response';
import { authorizedBy, joinedParam, optionalParam } from './gateway-request';

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
        authorizedBy(token),
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
        authorizedBy(token),
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
        authorizedBy(token),
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
        authorizedBy(token),
      ),
    );
  }

  private toQueryParams(criteria: DocumentListCriteria): ListQueryParams {
    return {
      search: optionalParam(criteria.search.trim()),
      searchCategories: joinedParam(criteria.searchCategories),
      searchEmitters: joinedParam(criteria.searchEmitters),
      categories: joinedParam(criteria.categories),
      statuses: joinedParam(criteria.statuses),
      emitters: joinedParam(criteria.emitters),
      from: criteria.from ?? undefined,
      to: criteria.to ?? undefined,
      sort: criteria.sort,
      direction: criteria.direction,
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
}
