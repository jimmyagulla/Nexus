import {
  ErrorCode,
  isErrorCode,
} from '@hexagonal-monorepo-template/domain';
import {
  ApiError,
  IHttpClient,
} from '@hexagonal-monorepo-template/ports';
import { sendJson } from '@hexagonal-monorepo-template/infrastructure';

export class FetchHttpClient implements IHttpClient {
  constructor(private readonly baseUrl: string) {}

  async request<T>(input: {
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    path: string;
    body?: unknown;
    token?: string;
  }): Promise<T> {
    const result = await sendJson({
      url: `${this.baseUrl}/${input.path}`,
      method: input.method,
      body: input.body,
      token: input.token,
    });
    if (!result.ok) {
      throw new Error(readErrorCode(result.body));
    }
    const envelope = result.body as { data: T };
    return envelope.data;
  }
}

function readErrorCode(body: unknown): string {
  if (
    typeof body === 'object' &&
    body !== null &&
    'message' in body &&
    typeof (body as ApiError).message === 'string' &&
    isErrorCode((body as ApiError).message)
  ) {
    return (body as ApiError).message;
  }
  return ErrorCode.ACCESS_DENIED;
}
