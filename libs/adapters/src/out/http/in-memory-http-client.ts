import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { HttpClient } from '@hexagonal-monorepo-template/ports';

export type RecordedHttpCall = {
  method: string;
  url: string;
  data?: unknown;
  config?: unknown;
};

export class InMemoryHttpClient implements HttpClient {
  readonly calls: RecordedHttpCall[] = [];
  private readonly replies = new Map<string, unknown>();

  reply(method: string, url: string, body: unknown): void {
    this.replies.set(this.key(method, url), body);
  }

  reject(method: string, url: string, error: Error): void {
    this.replies.set(this.key(method, url), error);
  }

  get<T>(url: string, config?: unknown): Promise<T> {
    return this.dispatch('get', url, undefined, config);
  }

  post<T>(url: string, data?: unknown, config?: unknown): Promise<T> {
    return this.dispatch('post', url, data, config);
  }

  put<T>(url: string, data?: unknown, config?: unknown): Promise<T> {
    return this.dispatch('put', url, data, config);
  }

  patch<T>(url: string, data?: unknown, config?: unknown): Promise<T> {
    return this.dispatch('patch', url, data, config);
  }

  delete<T>(url: string, config?: unknown): Promise<T> {
    return this.dispatch('delete', url, undefined, config);
  }

  private dispatch<T>(
    method: string,
    url: string,
    data: unknown,
    config: unknown,
  ): Promise<T> {
    this.calls.push({ method, url, data, config });
    const key = this.key(method, url);
    if (!this.replies.has(key)) {
      return Promise.reject(new Error(ErrorCode.ACCESS_DENIED));
    }

    const reply = this.replies.get(key);
    if (reply instanceof Error) {
      return Promise.reject(reply);
    }
    return Promise.resolve(reply as T);
  }

  private key(method: string, url: string): string {
    return `${method} ${url}`;
  }
}
