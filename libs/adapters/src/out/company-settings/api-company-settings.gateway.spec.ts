import { describe, expect, it } from 'vitest';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';
import { InMemoryHttpClient } from '../http/in-memory-http-client';
import { ApiCompanySettingsGateway } from './api-company-settings.gateway';

const snapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [] as DayOfWeek[],
  publicHolidays: [] as { id: string; date: string; label: string }[],
};

function httpReturning(body: unknown): InMemoryHttpClient {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/settings', body);
  http.reply('patch', 'companies/c1/name', body);
  http.reply('put', 'companies/c1/calendar/non-working-weekdays', body);
  return http;
}

describe('ApiCompanySettingsGateway', () => {
  it('reads the settings of a company from the envelope', async () => {
    const http = httpReturning({ status: 200, data: snapshot });

    await expect(
      new ApiCompanySettingsGateway(http).get('c1', 'token'),
    ).resolves.toEqual(snapshot);
    expect(http.calls).toEqual([
      {
        method: 'get',
        url: 'companies/c1/settings',
        data: undefined,
        config: { headers: { Authorization: 'Bearer token' } },
      },
    ]);
  });

  it('reads a payload that is not wrapped in an envelope', async () => {
    const http = httpReturning(snapshot);

    await expect(
      new ApiCompanySettingsGateway(http).get('c1', 'token'),
    ).resolves.toEqual(snapshot);
  });

  it('renames a company', async () => {
    const http = httpReturning({ status: 200, data: snapshot });

    await new ApiCompanySettingsGateway(http).rename('c1', 'Nexus', 'token');

    expect(http.calls).toEqual([
      {
        method: 'patch',
        url: 'companies/c1/name',
        data: { name: 'Nexus' },
        config: { headers: { Authorization: 'Bearer token' } },
      },
    ]);
  });

  it('replaces the non-working weekdays of a company', async () => {
    const http = httpReturning({ status: 200, data: snapshot });

    await new ApiCompanySettingsGateway(http).setNonWorkingWeekdays(
      'c1',
      [DayOfWeek.SUNDAY],
      'token',
    );

    expect(http.calls).toEqual([
      {
        method: 'put',
        url: 'companies/c1/calendar/non-working-weekdays',
        data: { weekdays: [DayOfWeek.SUNDAY] },
        config: { headers: { Authorization: 'Bearer token' } },
      },
    ]);
  });
});
