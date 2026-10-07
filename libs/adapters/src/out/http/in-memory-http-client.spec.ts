import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { InMemoryHttpClient } from './in-memory-http-client';

describe('InMemoryHttpClient', () => {
  it('returns the scripted body for a get', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1', { status: 200, data: { id: 'c1' } });

    await expect(http.get('companies/c1')).resolves.toEqual({
      status: 200,
      data: { id: 'c1' },
    });
  });

  it('records the method, url, data and config of a post', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies', { status: 201, data: { id: 'c1' } });

    await http.post('companies', { name: 'Acme' }, {
      headers: { Authorization: 'Bearer token' },
    });

    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies',
        data: { name: 'Acme' },
        config: { headers: { Authorization: 'Bearer token' } },
      },
    ]);
  });

  it('answers put, patch and delete with their scripted bodies', async () => {
    const http = new InMemoryHttpClient();
    http.reply('put', 'companies/c1', { updated: true });
    http.reply('patch', 'companies/c1', { patched: true });
    http.reply('delete', 'companies/c1', { deleted: true });

    await expect(http.put('companies/c1', { name: 'Nexus' })).resolves.toEqual({
      updated: true,
    });
    await expect(http.patch('companies/c1', { name: 'Nexus' })).resolves.toEqual(
      { patched: true },
    );
    await expect(http.delete('companies/c1')).resolves.toEqual({
      deleted: true,
    });
  });

  it('rejects a call that was not scripted', async () => {
    const http = new InMemoryHttpClient();

    await expect(http.get('companies/missing')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('rejects with the scripted error', async () => {
    const http = new InMemoryHttpClient();
    http.reject('delete', 'companies/c1', new Error(ErrorCode.ACCESS_DENIED));

    await expect(http.delete('companies/c1')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
