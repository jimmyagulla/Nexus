import { afterEach, describe, expect, it, vi } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { FetchHttpClient } from './fetch-http-client';

type CapturedRequest = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | undefined;
};

type SentInit = {
  method: string;
  headers: Record<string, string>;
  body?: string;
};

type StubbedReply = {
  status: number;
  readBody: () => unknown;
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
});
