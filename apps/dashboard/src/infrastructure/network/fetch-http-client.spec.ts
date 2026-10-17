import { afterEach, describe, expect, it, vi } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { FetchHttpClient } from './fetch-http-client';

type CapturedRequest = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | FormData | undefined;
};

type SentInit = {
  method: string;
  headers: Record<string, string>;
  body?: string | FormData;
};

type StubbedReply = {
  status: number;
  readBody: () => unknown;
  bytes?: Uint8Array;
};

function ok(body: unknown): StubbedReply {
  return { status: 200, readBody: () => body };
}

function failing(status: number, body: unknown): StubbedReply {
  return { status, readBody: () => body };
}

function stubFetch(reply: StubbedReply): CapturedRequest[] {
  const sent: CapturedRequest[] = [];
  vi.stubGlobal('fetch', async (url: string, init: SentInit) => {
    sent.push({
      url,
      method: init.method,
      headers: { ...init.headers },
      body: init.body,
    });
    return {
      ok: reply.status >= 200 && reply.status < 300,
      status: reply.status,
      json: async () => reply.readBody(),
      arrayBuffer: async () => (reply.bytes ?? new Uint8Array()).buffer,
    };
  });
  return sent;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('FetchHttpClient', () => {
  it('joins the base url and the requested path', async () => {
    const sent = stubFetch(ok({ status: 200, data: null }));

    await new FetchHttpClient('https://api.test').get('companies/c1/settings');

    expect(sent[0]?.url).toBe('https://api.test/companies/c1/settings');
  });

  it('joins a base url that already ends with a slash', async () => {
    const sent = stubFetch(ok({ status: 200, data: null }));

    await new FetchHttpClient('https://api.test/').get('/companies/c1');

    expect(sent[0]?.url).toBe('https://api.test/companies/c1');
  });

  it('sends get, post, put, patch and delete', async () => {
    const sent = stubFetch(ok({ status: 200, data: null }));
    const client = new FetchHttpClient('https://api.test');

    await client.get('companies/c1');
    await client.post('companies/c1', { name: 'Acme' });
    await client.put('companies/c1', { name: 'Acme' });
    await client.patch('companies/c1', { name: 'Acme' });
    await client.delete('companies/c1');

    expect(sent.map((call) => call.method)).toEqual([
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
    ]);
  });

  it('serialises the body as json', async () => {
    const sent = stubFetch(ok({ status: 200, data: null }));

    await new FetchHttpClient('https://api.test').post('companies', {
      name: 'Acme',
    });

    expect(sent[0]?.body).toBe('{"name":"Acme"}');
  });

  it('declares the json content type', async () => {
    const sent = stubFetch(ok({ status: 200, data: null }));

    await new FetchHttpClient('https://api.test').get('companies/c1/settings');

    expect(sent[0]?.headers['Content-Type']).toBe('application/json');
  });

  it('sends no body when the request carries none', async () => {
    const sent = stubFetch(ok({ status: 200, data: null }));

    await new FetchHttpClient('https://api.test').get('companies/c1/settings');

    expect(sent[0]?.body).toBeUndefined();
  });

  it('forwards an authorization header given in the config', async () => {
    const sent = stubFetch(ok({ status: 200, data: null }));

    await new FetchHttpClient('https://api.test').get('companies/c1/settings', {
      headers: { Authorization: 'Bearer token-1' },
    });

    expect(sent[0]?.headers['Authorization']).toBe('Bearer token-1');
  });

  it('sends no authorisation header without a config', async () => {
    const sent = stubFetch(ok({ status: 200, data: null }));

    await new FetchHttpClient('https://api.test').get('companies/c1/settings');

    expect(sent[0]?.headers['Authorization']).toBeUndefined();
  });

  it('returns the response body without unwrapping it', async () => {
    stubFetch(ok({ status: 200, message: 'OK', data: { id: 'c1' } }));

    await expect(
      new FetchHttpClient('https://api.test').get('companies/c1/settings'),
    ).resolves.toEqual({ status: 200, message: 'OK', data: { id: 'c1' } });
  });

  it('translates the error code carried by a failed response', async () => {
    stubFetch(
      failing(400, { status: 400, message: ErrorCode.REQUIRED_INFORMATION }),
    );

    await expect(
      new FetchHttpClient('https://api.test').post('companies'),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('falls back to access denied when the message is not a known error code', async () => {
    stubFetch(failing(500, { status: 500, message: 'Internal Server Error' }));

    await expect(
      new FetchHttpClient('https://api.test').post('companies'),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('falls back to access denied when the error body carries no message', async () => {
    stubFetch(failing(502, { status: 502 }));

    await expect(
      new FetchHttpClient('https://api.test').post('companies'),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('falls back to access denied when the message is not a string', async () => {
    stubFetch(failing(502, { status: 502, message: 42 }));

    await expect(
      new FetchHttpClient('https://api.test').post('companies'),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('falls back to access denied when the error body is not an object', async () => {
    stubFetch(failing(503, 'Service Unavailable'));

    await expect(
      new FetchHttpClient('https://api.test').post('companies'),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('falls back to access denied when the error body is null', async () => {
    stubFetch(failing(503, null));

    await expect(
      new FetchHttpClient('https://api.test').post('companies'),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('fails when the response carries no json body', async () => {
    stubFetch({
      status: 204,
      readBody: () => {
        throw new SyntaxError('Unexpected end of JSON input');
      },
    });

    await expect(
      new FetchHttpClient('https://api.test').delete('companies/c1'),
    ).rejects.toThrow();
  });

  it('reads the raw bytes of a file behind a full url, without credentials', async () => {
    const sent = stubFetch({ status: 200, readBody: () => null, bytes: Uint8Array.from([0x25, 0x50]) });

    await expect(
      new FetchHttpClient('https://api.test').getBytes('https://files.test/arret?token=t'),
    ).resolves.toEqual(Uint8Array.from([0x25, 0x50]));
    expect(sent[0]).toEqual({
      url: 'https://files.test/arret?token=t',
      method: 'GET',
      headers: {},
      body: undefined,
    });
  });

  it('keeps a data url as it is', async () => {
    const sent = stubFetch({ status: 200, readBody: () => null, bytes: Uint8Array.from([1]) });

    await new FetchHttpClient('https://api.test').getBytes('data:text/csv;base64,YQ==');

    expect(sent[0]?.url).toBe('data:text/csv;base64,YQ==');
  });

  it('refuses a file the storage no longer serves', async () => {
    stubFetch(failing(403, null));

    await expect(
      new FetchHttpClient('https://api.test').getBytes('https://files.test/expired'),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('posts the fields and the files as a form, without forcing a content type', async () => {
    const sent = stubFetch(ok({ status: 201, data: [] }));

    await new FetchHttpClient('https://api.test').postMultipart(
      'documents',
      {
        fields: [
          { name: 'category', value: 'OTHER' },
          { name: 'names', value: 'Scan' },
        ],
        files: [
          { field: 'files', fileName: 'scan.pdf', contentType: 'application/pdf', content: Uint8Array.from([0x25, 0x50]) },
        ],
      },
      { headers: { Authorization: 'Bearer t1' } },
    );

    const form = sent[0]?.body as FormData;
    const file = form.get('files') as File;
    expect(sent[0]?.method).toBe('POST');
    expect(sent[0]?.headers).toEqual({ Authorization: 'Bearer t1' });
    expect(form.get('category')).toBe('OTHER');
    expect(form.getAll('names')).toEqual(['Scan']);
    expect(file.name).toBe('scan.pdf');
    expect(file.type).toBe('application/pdf');
    expect(new Uint8Array(await file.arrayBuffer())).toEqual(Uint8Array.from([0x25, 0x50]));
  });

  it('translates the error code of a refused form', async () => {
    stubFetch(failing(413, { message: ErrorCode.FILE_TOO_LARGE }));

    await expect(
      new FetchHttpClient('https://api.test').postMultipart('documents', { fields: [], files: [] }),
    ).rejects.toThrow(ErrorCode.FILE_TOO_LARGE);
  });
});
