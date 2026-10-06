import { sendJson } from './send-json';

type RecordedRequest = {
  url: string;
  method: string | undefined;
  headers: unknown;
  body: BodyInit | null | undefined;
};

type StubbedResponse = Pick<Response, 'ok' | 'status' | 'json'>;

const requests: RecordedRequest[] = [];

function respondWith(response: StubbedResponse): void {
  vi.stubGlobal(
    'fetch',
    async (url: string, init: RequestInit): Promise<StubbedResponse> => {
      requests.push({
        url,
        method: init.method,
        headers: init.headers,
        body: init.body,
      });
      return response;
    },
  );
}

function jsonResponse(status: number, payload: unknown): StubbedResponse {
  return { ok: status < 400, status, json: async () => payload };
}

function failWith(failure: Error): void {
  vi.stubGlobal('fetch', async (): Promise<StubbedResponse> => {
    throw failure;
  });
}

afterEach(() => {
  requests.length = 0;
  vi.unstubAllGlobals();
});

describe('sendJson', () => {
  it('returns the parsed payload with the status of the transport', async () => {
    respondWith(jsonResponse(200, { id: 'c1' }));

    await expect(
      sendJson({ url: 'https://api.test/companies/c1', method: 'GET' }),
    ).resolves.toEqual({ ok: true, status: 200, body: { id: 'c1' } });
  });

  it('sends a json request to the given url with the given method', async () => {
    respondWith(jsonResponse(204, null));

    await sendJson({ url: 'https://api.test/companies/c1', method: 'DELETE' });

    expect(requests).toEqual([
      {
        url: 'https://api.test/companies/c1',
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: undefined,
      },
    ]);
  });

  it('carries the token as a bearer credential', async () => {
    respondWith(jsonResponse(200, {}));

    await sendJson({
      url: 'https://api.test/companies',
      method: 'GET',
      token: 'token-1',
    });

    expect(requests[0].headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer token-1',
    });
  });

  it('serializes the body as json', async () => {
    respondWith(jsonResponse(201, {}));

    await sendJson({
      url: 'https://api.test/companies',
      method: 'POST',
      body: { name: 'Acme' },
    });

    expect(requests[0].body).toBe('{"name":"Acme"}');
  });

  it('sends an explicit null body as a json null', async () => {
    respondWith(jsonResponse(200, {}));

    await sendJson({
      url: 'https://api.test/companies',
      method: 'POST',
      body: null,
    });

    expect(requests[0].body).toBe('null');
  });

  it('reports a refused request instead of throwing', async () => {
    respondWith(jsonResponse(422, { code: 'REQUIRED_INFORMATION' }));

    await expect(
      sendJson({ url: 'https://api.test/companies', method: 'POST', body: {} }),
    ).resolves.toEqual({
      ok: false,
      status: 422,
      body: { code: 'REQUIRED_INFORMATION' },
    });
  });

  it('propagates a transport failure', async () => {
    failWith(new Error('network unreachable'));

    await expect(
      sendJson({ url: 'https://api.test/companies', method: 'GET' }),
    ).rejects.toThrow('network unreachable');
  });

  it('propagates a response that is not json', async () => {
    respondWith({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('Unexpected end of JSON input');
      },
    });

    await expect(
      sendJson({ url: 'https://api.test/companies', method: 'GET' }),
    ).rejects.toThrow('Unexpected end of JSON input');
  });
});
