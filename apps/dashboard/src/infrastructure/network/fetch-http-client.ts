import {
  ErrorCode,
  isErrorCode,
} from '@hexagonal-monorepo-template/domain';
import {
  IHttpClient,
  MultipartBody,
} from '@hexagonal-monorepo-template/ports';

type Body = string | FormData | undefined;

/**
 * The only place of the dashboard that calls `fetch`: everything else reaches
 * the network through IHttpClient.
 */
export class FetchHttpClient implements IHttpClient {
  constructor(private readonly baseUrl: string) {}

  get<T>(url: string, config?: unknown): Promise<T> {
    return this.sendJson('GET', url, undefined, config);
  }

  async getBytes(url: string, config?: unknown): Promise<Uint8Array> {
    const response = await this.send('GET', url, undefined, this.authorization(config));
    if (!response.ok) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return new Uint8Array(await response.arrayBuffer());
  }

  post<T>(url: string, data?: unknown, config?: unknown): Promise<T> {
    return this.sendJson('POST', url, data, config);
  }

  /** The browser sets the multipart boundary itself: no content type is forced. */
  async postMultipart<T>(
    url: string,
    body: MultipartBody,
    config?: unknown,
  ): Promise<T> {
    const response = await this.send('POST', url, this.toFormData(body), this.authorization(config));
    return this.readJson<T>(response);
  }

  put<T>(url: string, data?: unknown, config?: unknown): Promise<T> {
    return this.sendJson('PUT', url, data, config);
  }

  patch<T>(url: string, data?: unknown, config?: unknown): Promise<T> {
    return this.sendJson('PATCH', url, data, config);
  }

  delete<T>(url: string, config?: unknown): Promise<T> {
    return this.sendJson('DELETE', url, undefined, config);
  }

  private async sendJson<T>(
    method: string,
    url: string,
    data: unknown,
    config: unknown,
  ): Promise<T> {
    const response = await this.send(
      method,
      url,
      data === undefined ? undefined : JSON.stringify(data),
      { 'Content-Type': 'application/json', ...this.authorization(config) },
    );
    return this.readJson<T>(response);
  }

  private send(
    method: string,
    url: string,
    body: Body,
    headers: Record<string, string>,
  ): Promise<Response> {
    return fetch(this.joinUrl(url), { method, headers, body });
  }

  private async readJson<T>(response: Response): Promise<T> {
    const body: unknown = await response.json();
    if (!response.ok) {
      throw new Error(this.errorCodeOf(body));
    }
    return body as T;
  }

  private toFormData(body: MultipartBody): FormData {
    const form = new FormData();
    for (const field of body.fields) {
      form.append(field.name, field.value);
    }
    for (const file of body.files) {
      form.append(
        file.field,
        new Blob([file.content as Uint8Array<ArrayBuffer>], { type: file.contentType }),
        file.fileName,
      );
    }
    return form;
  }

  /** A full URL (`https:`, `data:`…) is kept as is; a path joins the base URL. */
  private joinUrl(path: string): string {
    if (/^[a-z][a-z\d+.-]*:/i.test(path)) {
      return path;
    }
    const base = this.baseUrl.endsWith('/')
      ? this.baseUrl.slice(0, -1)
      : this.baseUrl;
    const relative = path.startsWith('/') ? path : `/${path}`;
    return `${base}${relative}`;
  }

  private authorization(config: unknown): Record<string, string> {
    const authorization = this.headersOf(config)['Authorization'];
    return authorization === undefined ? {} : { Authorization: authorization };
  }

  private headersOf(config: unknown): Record<string, string> {
    if (!isRecord(config) || !isRecord(config['headers'])) {
      return {};
    }
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(config['headers'])) {
      if (typeof value === 'string') {
        headers[key] = value;
      }
    }
    return headers;
  }

  private errorCodeOf(body: unknown): string {
    const message = isRecord(body) ? body['message'] : undefined;
    return typeof message === 'string' && isErrorCode(message)
      ? message
      : ErrorCode.ACCESS_DENIED;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
