import {
  CabinetExchangeSnapshot,
  ExchangeFileInput,
} from '@hexagonal-monorepo-template/domain';
import {
  ApiResponse,
  decodeBase64,
  encodeBase64,
  unwrapResponse,
} from '@hexagonal-monorepo-template/infrastructure';
import {
  API_ROUTES,
  cabinetExchangePath,
  ICabinetExchangeGateway,
  IHttpClient,
} from '@hexagonal-monorepo-template/ports';

type DraftInput = { category?: string | null; file?: ExchangeFileInput | null };

type FilePayload = {
  fileName: string;
  mimeType: string;
  contentBase64: string;
};

export class ApiCabinetExchangeGateway implements ICabinetExchangeGateway {
  constructor(private readonly httpClient: IHttpClient) {}

  async createDraft(
    companyId: string,
    input: DraftInput,
    token: string,
  ): Promise<CabinetExchangeSnapshot> {
    return unwrapResponse(
      await this.httpClient.post<ApiResponse<CabinetExchangeSnapshot>>(
        cabinetExchangePath('', { companyId }),
        this.toDraftPayload(input),
        this.authorized(token),
      ),
    );
  }

  async markToTransmit(
    companyId: string,
    exchangeId: string,
    input: DraftInput,
    token: string,
  ): Promise<CabinetExchangeSnapshot> {
    return unwrapResponse(
      await this.httpClient.post<ApiResponse<CabinetExchangeSnapshot>>(
        cabinetExchangePath(API_ROUTES.cabinetExchanges.toTransmit, {
          companyId,
          exchangeId,
        }),
        this.toDraftPayload(input),
        this.authorized(token),
      ),
    );
  }

  async transmit(
    companyId: string,
    exchangeIds: readonly string[],
    token: string,
  ): Promise<readonly CabinetExchangeSnapshot[]> {
    return unwrapResponse(
      await this.httpClient.post<ApiResponse<CabinetExchangeSnapshot[]>>(
        cabinetExchangePath(API_ROUTES.cabinetExchanges.transmission, {
          companyId,
        }),
        { exchangeIds },
        this.authorized(token),
      ),
    );
  }

  async list(
    companyId: string,
    token: string,
  ): Promise<readonly CabinetExchangeSnapshot[]> {
    return unwrapResponse(
      await this.httpClient.get<ApiResponse<CabinetExchangeSnapshot[]>>(
        cabinetExchangePath('', { companyId }),
        this.authorized(token),
      ),
    );
  }

  async open(
    companyId: string,
    exchangeId: string,
    token: string,
  ): Promise<CabinetExchangeSnapshot> {
    return unwrapResponse(
      await this.httpClient.post<ApiResponse<CabinetExchangeSnapshot>>(
        cabinetExchangePath(API_ROUTES.cabinetExchanges.consultation, {
          companyId,
          exchangeId,
        }),
        undefined,
        this.authorized(token),
      ),
    );
  }

  async download(
    companyId: string,
    exchangeId: string,
    token: string,
  ): Promise<ExchangeFileInput> {
    const payload = unwrapResponse(
      await this.httpClient.get<ApiResponse<FilePayload>>(
        cabinetExchangePath(API_ROUTES.cabinetExchanges.file, {
          companyId,
          exchangeId,
        }),
        this.authorized(token),
      ),
    );
    return {
      fileName: payload.fileName,
      mimeType: payload.mimeType,
      content: decodeBase64(payload.contentBase64),
    };
  }

  private toDraftPayload(input: DraftInput): {
    category: string | null;
    file: FilePayload | null;
  } {
    return {
      category: input.category ?? null,
      file: input.file === undefined || input.file === null
        ? null
        : this.toFilePayload(input.file),
    };
  }

  private toFilePayload(file: ExchangeFileInput): FilePayload {
    return {
      fileName: file.fileName,
      mimeType: file.mimeType,
      contentBase64: encodeBase64(file.content),
    };
  }

  private authorized(token: string): { headers: { Authorization: string } } {
    return { headers: { Authorization: `Bearer ${token}` } };
  }
}
