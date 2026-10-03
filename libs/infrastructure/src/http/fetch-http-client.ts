import { ApiResponse, HttpClient, HttpRequestConfig } from '@hexagonal-monorepo-template/ports';

export function unwrapResponse<T>(payload: ApiResponse<T>): T {
  if (
    payload !== null &&
    typeof payload === 'object' &&
    'data' in payload &&
    'status' in payload
  ) {
    return payload.data;
  }
  return payload as T;
}

export class FetchHttpClient implements HttpClient {
  constructor(private readonly baseUrl: string) {}

  get<T>(url: string, config?: HttpRequestConfig): Promise<T> {
    return this.request<T>(url, { method: 'GET' }, config);
  }

  post<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T> {
    return this.request<T>(url, { method: 'POST', body: data }, config);
  }

  put<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T> {
    return this.request<T>(url, { method: 'PUT', body: data }, config);
  }

  patch<T>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<T> {
    return this.request<T>(url, { method: 'PATCH', body: data }, config);
  }

  delete<T>(url: string, config?: HttpRequestConfig): Promise<T> {
    return this.request<T>(url, { method: 'DELETE' }, config);
  }

  private async request<T>(
    url: string,
    init: { method: string; body?: unknown },
    config?: HttpRequestConfig,
  ): Promise<T> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...config?.headers,
    };
    if (init.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    const response = await fetch(`${this.baseUrl}/${url}`, {
      method: init.method,
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });
    const payload: unknown = await response.json();
    if (!response.ok) {
      const message =
        typeof payload === 'object' &&
        payload !== null &&
        'message' in payload &&
        typeof payload.message === 'string'
          ? payload.message
          : response.statusText;
      throw new Error(message);
    }
    return payload as T;
  }
}
