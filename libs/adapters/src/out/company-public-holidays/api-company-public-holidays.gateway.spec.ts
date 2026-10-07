import { describe, expect, it } from 'vitest';
import { InMemoryHttpClient } from '../http/in-memory-http-client';
import { ApiCompanyPublicHolidaysGateway } from './api-company-public-holidays.gateway';

const snapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [],
  publicHolidays: [] as { id: string; date: string; label: string }[],
};

function httpReturning(body: unknown): InMemoryHttpClient {
  const http = new InMemoryHttpClient();
  http.reply('post', 'companies/c1/calendar/public-holidays', body);
  http.reply('patch', 'companies/c1/calendar/public-holidays/ph-1', body);
  http.reply('delete', 'companies/c1/calendar/public-holidays/ph-1', body);
  return http;
}

describe('ApiCompanyPublicHolidaysGateway', () => {
  it('retains a public holiday', async () => {
    const http = httpReturning({ status: 200, data: snapshot });

    await expect(
      new ApiCompanyPublicHolidaysGateway(http).add(
        'c1',
        '2026-07-14',
        'Fête nationale',
        'token',
      ),
    ).resolves.toEqual(snapshot);
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/calendar/public-holidays',
        data: { date: '2026-07-14', label: 'Fête nationale' },
        config: { headers: { Authorization: 'Bearer token' } },
      },
    ]);
  });

  it('updates a retained public holiday', async () => {
    const http = httpReturning({ status: 200, data: snapshot });

    await new ApiCompanyPublicHolidaysGateway(http).update(
      'c1',
      'ph-1',
      '2026-11-11',
      'Armistice',
      'token',
    );

    expect(http.calls).toEqual([
      {
        method: 'patch',
        url: 'companies/c1/calendar/public-holidays/ph-1',
        data: { date: '2026-11-11', label: 'Armistice' },
        config: { headers: { Authorization: 'Bearer token' } },
      },
    ]);
  });

  it('removes a retained public holiday', async () => {
    const http = httpReturning({ status: 200, data: snapshot });

    await new ApiCompanyPublicHolidaysGateway(http).remove('c1', 'ph-1', 'token');

    expect(http.calls).toEqual([
      {
        method: 'delete',
        url: 'companies/c1/calendar/public-holidays/ph-1',
        data: undefined,
        config: { headers: { Authorization: 'Bearer token' } },
      },
    ]);
  });
});
