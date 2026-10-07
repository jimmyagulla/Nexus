import {
  ErrorCode,
  isErrorCode,
} from '@hexagonal-monorepo-template/domain';
import { sendJson } from '@hexagonal-monorepo-template/infrastructure';
import { IHttpClient } from '@hexagonal-monorepo-template/ports';

export class FetchHttpClient implements IHttpClient {
  constructor(private readonly baseUrl: string) {}

  get<T>(url: string, config?: unknown): Promise<T> {
    return this.send('GET', url, undefined, config);
  }

  post<T>(url: string, data?: unknown, config?: unknown): Promise<T> {
    return this.send('POST', url, data, config);
  }

  put<T>(url: string, data?: unknown, config?: unknown): Promise<T> {
    return this.send('PUT', url, data, config);
  }

  patch<T>(url: string, data?: unknown, config?: unknown): Promise<T> {
    return this.send('PATCH', url, data, config);
  }

  delete<T>(url: string, config?: unknown): Promise<T> {
    return this.send('DELETE', url, undefined, config);
  }

  private async send<T>(
    method: string,
    url: string,
    data: unknown,
    config: unknown,
  ): Promise<T> {
    const result = await sendJson({
      url: this.joinUrl(url),
      method,
      body: data,
      token: bearerToken(config),
    });
    if (!result.ok) {
      throw new Error(readErrorCode(result.body));
    }
    return result.body as T;
  }

  private joinUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const base = this.baseUrl.endsWith('/')
      ? this.baseUrl.slice(0, -1)
      : this.baseUrl;
    const relative = path.startsWith('/') ? path : `/${path}`;
    return `${base}${relative}`;
  }
}

function bearerToken(config: unknown): string | undefined {
  const authorization = headersOf(config)?.['Authorization'];
  if (authorization === undefined) {
    return undefined;
  }
  const prefix = 'Bearer ';
  return authorization.startsWith(prefix)
    ? authorization.slice(prefix.length)
    : authorization;
}

function headersOf(config: unknown): Record<string, string> | undefined {
  if (!isRecord(config) || !isRecord(config['headers'])) {
    return undefined;
  }

  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(config['headers'])) {
    if (typeof value === 'string') {
      headers[key] = value;
    }
  }
  return headers;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readErrorCode(body: unknown): string {
  if (!isRecord(body)) {
    return ErrorCode.ACCESS_DENIED;
  }

  const message = body['message'];
  if (typeof message === 'string' && isErrorCode(message)) {
    return message;
  }
  return ErrorCode.ACCESS_DENIED;
}
