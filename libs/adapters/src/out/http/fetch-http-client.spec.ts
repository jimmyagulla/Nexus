import { afterEach, describe, expect, it, vi } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { FetchHttpClient } from './fetch-http-client';

type SentRequest = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | undefined;
};

type SentInit = {
  method: string;
  headers: Record<string, string>;
  body: string | undefined;
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

function withoutJsonBody(status: number): StubbedReply {
  return {
    status,
    readBody: () => {
      throw new SyntaxError('Unexpected end of JSON input');
    },
  };
}

function stubFetch(reply: StubbedReply): SentRequest[] {
  const sent: SentRequest[] = [];
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
    const sent = stubFetch(ok({ data: null }));
    const client = new FetchHttpClient('https://api.test');

    await client.request({ method: 'GET', path: 'companies/c1/settings' });

    expect(sent[0]?.url).toBe('https://api.test/companies/c1/settings');
  });

  it('sends the requested method', async () => {
    const sent = stubFetch(ok({ data: null }));
    const client = new FetchHttpClient('https://api.test');

    await client.request({ method: 'PATCH', path: 'companies/c1/name' });

    expect(sent[0]?.method).toBe('PATCH');
  });

  it('serialises the body as json', async () => {
    const sent = stubFetch(ok({ data: null }));
    const client = new FetchHttpClient('https://api.test');

    await client.request({
      method: 'PATCH',
      path: 'companies/c1/name',
      body: { name: 'Acme' },
    });

    expect(sent[0]?.body).toBe('{"name":"Acme"}');
  });

  it('declares the json content type', async () => {
    const sent = stubFetch(ok({ data: null }));
    const client = new FetchHttpClient('https://api.test');

    await client.request({ method: 'GET', path: 'companies/c1/settings' });

    expect(sent[0]?.headers['Content-Type']).toBe('application/json');
  });

  it('sends no body when the request carries none', async () => {
    const sent = stubFetch(ok({ data: null }));
    const client = new FetchHttpClient('https://api.test');

    await client.request({ method: 'GET', path: 'companies/c1/settings' });

    expect(sent[0]?.body).toBeUndefined();
  });

  it('authorises the request with the given token', async () => {
    const sent = stubFetch(ok({ data: null }));
    const client = new FetchHttpClient('https://api.test');

    await client.request({
      method: 'GET',
      path: 'companies/c1/settings',
      token: 'token-1',
    });

    expect(sent[0]?.headers['Authorization']).toBe('Bearer token-1');
  });

  it('sends no authorisation header without a token', async () => {
    const sent = stubFetch(ok({ data: null }));
    const client = new FetchHttpClient('https://api.test');

    await client.request({ method: 'GET', path: 'companies/c1/settings' });

    expect(sent[0]?.headers).toEqual({ 'Content-Type': 'application/json' });
  });

  it('unwraps the data of the success envelope', async () => {
    stubFetch(ok({ status: 200, message: 'OK', data: { id: 'c1' } }));
    const client = new FetchHttpClient('https://api.test');

    await expect(
      client.request({ method: 'GET', path: 'companies/c1/settings' }),
    ).resolves.toEqual({ id: 'c1' });
  });

  it('translates the error code carried by a failed response', async () => {
    stubFetch(
      failing(400, { status: 400, message: ErrorCode.REQUIRED_INFORMATION }),
    );
    const client = new FetchHttpClient('https://api.test');

    await expect(
      client.request({ method: 'POST', path: 'companies' }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('falls back to access denied when the message is not a known error code', async () => {
    stubFetch(failing(500, { status: 500, message: 'Internal Server Error' }));
    const client = new FetchHttpClient('https://api.test');

    await expect(
      client.request({ method: 'POST', path: 'companies' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('falls back to access denied when the error body carries no message', async () => {
    stubFetch(failing(502, { status: 502 }));
    const client = new FetchHttpClient('https://api.test');

    await expect(
      client.request({ method: 'POST', path: 'companies' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('falls back to access denied when the message is not a string', async () => {
    stubFetch(failing(502, { status: 502, message: 42 }));
    const client = new FetchHttpClient('https://api.test');

    await expect(
      client.request({ method: 'POST', path: 'companies' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('falls back to access denied when the error body is not an object', async () => {
    stubFetch(failing(503, 'Service Unavailable'));
    const client = new FetchHttpClient('https://api.test');

    await expect(
      client.request({ method: 'POST', path: 'companies' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('falls back to access denied when the error body is null', async () => {
    stubFetch(failing(503, null));
    const client = new FetchHttpClient('https://api.test');

    await expect(
      client.request({ method: 'POST', path: 'companies' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses a success envelope that carries no data', async () => {
    stubFetch(ok({ status: 200, message: 'OK' }));
    const client = new FetchHttpClient('https://api.test');

    await expect(
      client.request({ method: 'DELETE', path: 'companies/c1' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses a success response that is not an envelope', async () => {
    stubFetch(ok('Created'));
    const client = new FetchHttpClient('https://api.test');

    await expect(
      client.request({ method: 'POST', path: 'companies' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses a success response with no body at all', async () => {
    stubFetch(ok(null));
    const client = new FetchHttpClient('https://api.test');

    await expect(
      client.request({ method: 'POST', path: 'companies' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('accepts a null payload, which the success envelope allows', async () => {
    stubFetch(ok({ status: 200, message: 'OK', data: null }));
    const client = new FetchHttpClient('https://api.test');

    await expect(
      client.request({ method: 'DELETE', path: 'companies/c1' }),
    ).resolves.toBeNull();
  });

  it('fails when the response carries no json body', async () => {
    stubFetch(withoutJsonBody(204));
    const client = new FetchHttpClient('https://api.test');

    await expect(
      client.request({ method: 'DELETE', path: 'companies/c1' }),
    ).rejects.toThrow();
  });
});
