import { describe, expect, it } from 'vitest';
import { InMemoryHttpClient } from '../http/in-memory-http-client';
import { ApiPresenceGateway } from './api-presence.gateway';

const camille = {
  id: 'p1',
  employeeId: 'e1',
  employeeName: 'Camille Martin',
  month: '2026-10',
  workedDays: 20,
  proposedWorkedDays: 22,
  adjustments: [
    {
      actorId: 'user-1',
      occurredAt: '2026-10-13T09:00:00.000Z',
      before: 22,
      after: 20,
    },
  ],
  leaves: [
    {
      id: 'a1',
      type: 'Congés payés',
      start: '2026-10-05',
      end: '2026-10-07',
      days: 3,
    },
  ],
  absences: [
    {
      id: 'a2',
      type: 'Autre',
      start: '2026-10-08',
      end: '2026-10-08',
      days: 1,
    },
  ],
  sickLeaves: [{ id: 's1', date: '2026-10-14' }],
  overtime: [{ id: 'h1', date: '2026-10-12', hours: 2 }],
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
      new ApiPresenceGateway(http).list('c1', {}, 'token'),
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

  it('lists the presences of an employee over a period', async () => {
    const http = new InMemoryHttpClient();
    http.reply(
      'get',
      'companies/c1/presences?employeeId=e1&from=2026-08&to=2026-10',
      { status: 200, data: list },
    );

    await new ApiPresenceGateway(http).list(
      'c1',
      { employeeId: 'e1', from: '2026-08', to: '2026-10' },
      'token',
    );

    expect(http.calls).toMatchObject([
      {
        method: 'get',
        url: 'companies/c1/presences?employeeId=e1&from=2026-08&to=2026-10',
      },
    ]);
  });

  it('leaves out the filters nobody chose', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/presences?from=2026-08', {
      status: 200,
      data: list,
    });

    await new ApiPresenceGateway(http).list(
      'c1',
      { from: '2026-08' },
      'token',
    );

    expect(http.calls).toMatchObject([
      { url: 'companies/c1/presences?from=2026-08' },
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

  it('corrects the worked days of a presence', async () => {
    const http = new InMemoryHttpClient();
    http.reply('patch', 'companies/c1/presences/p1/worked-days', {
      status: 200,
      data: camille,
    });

    await expect(
      new ApiPresenceGateway(http).adjustWorkedDays('c1', 'p1', 20, 'token'),
    ).resolves.toEqual(camille);
    expect(http.calls).toEqual([
      {
        method: 'patch',
        url: 'companies/c1/presences/p1/worked-days',
        data: { workedDays: 20 },
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
