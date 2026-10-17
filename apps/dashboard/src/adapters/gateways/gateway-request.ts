/** Request config of IHttpClient that carries the session token. */
export type AuthorizedRequest = { headers: { Authorization: string } };

/** A list as a single query parameter (`a,b`); absent when the list is empty. */
export function joinedParam(values: readonly string[]): string | undefined {
  return values.length === 0 ? undefined : values.join(',');
}

/** A text as a query parameter; absent when it is empty. */
export function optionalParam(value: string): string | undefined {
  return value === '' ? undefined : value;
}

/** The config of a request made on behalf of the session. */
export function authorizedBy(token: string): AuthorizedRequest {
  return { headers: { Authorization: `Bearer ${token}` } };
}
