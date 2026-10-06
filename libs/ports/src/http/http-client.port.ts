export interface IHttpClient {
  request<T>(input: {
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    path: string;
    body?: unknown;
    token?: string;
  }): Promise<T>;
}

export const IHttpClient = Symbol('IHttpClient');
