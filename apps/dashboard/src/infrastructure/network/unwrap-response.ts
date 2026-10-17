export type EnvelopedResponse<T> = { data: T; status: number };
export type ApiResponse<T> = T | EnvelopedResponse<T>;

export function unwrapResponse<T>(payload: ApiResponse<T>): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    'status' in payload
  ) {
    return (payload as EnvelopedResponse<T>).data;
  }
  return payload as T;
}
