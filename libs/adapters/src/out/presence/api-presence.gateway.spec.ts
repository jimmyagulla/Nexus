import { describe, expect, it } from 'vitest';
import { InMemoryHttpClient } from '../http/in-memory-http-client';
import { ApiPresenceGateway } from './api-presence.gateway';

const camille = {
  id: 'p1',
  employeeId: 'e1',
  employeeName: 'Camille Martin',
  month: '2026-10',
  workedDays: 22,
};

const list = {
  presences: [camille],
  employees: [{ id: 'e1', fullName: 'Camille Martin' }],
  canManage: true,
};

describe('ApiPresenceGateway', () => {
  it('lists the presences of a company from the envelope', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/presences', { status: 200, data: list });

    await expect(
      new ApiPresenceGateway(http).list('c1', 'token'),
    ).resolves.toEqual({
      presences: [camille],
      employees: [{ id: 'e1', companyId: 'c1', fullName: 'Camille Martin' }],
      canManage: true,
    });
    expect(http.calls).toEqual([
      {
        method: 'get',
        url: 'companies/c1/presences',
        data: undefined,
        config: { headers: { Authorization: 'Bearer token' } },
      },
    ]);
  });

  it('opens the month of an employee', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/presences', {
      status: 201,
      data: camille,
    });

    await expect(
      new ApiPresenceGateway(http).open('c1', 'e1', '2026-10', 'token'),
    ).resolves.toEqual(camille);
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/presences',
        data: { employeeId: 'e1', month: '2026-10' },
        config: { headers: { Authorization: 'Bearer token' } },
      },
    ]);
  });

  it('lets the refusal of the api through', async () => {
    const http = new InMemoryHttpClient();
    http.reject('post', 'companies/c1/presences', new Error('POTENTIAL_DUPLICATE'));

    await expect(
      new ApiPresenceGateway(http).open('c1', 'e1', '2026-10', 'token'),
    ).rejects.toThrow('POTENTIAL_DUPLICATE');
  });
});
