export type JsonRequest = {
  url: string;
  method: string;
  body?: unknown;
  token?: string;
};

export type JsonResponse = {
  ok: boolean;
  status: number;
  body: unknown;
};

export async function sendJson(input: JsonRequest): Promise<JsonResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (input.token !== undefined) {
    headers['Authorization'] = `Bearer ${input.token}`;
  }

  const response = await fetch(input.url, {
    method: input.method,
    headers,
    body: input.body === undefined ? undefined : JSON.stringify(input.body),
  });
  const body: unknown = await response.json();
  return { ok: response.ok, status: response.status, body };
}
