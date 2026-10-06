import { describe, expect, it } from 'vitest';
import {
  CompanySettingsSnapshot,
  DayOfWeek,
} from '@hexagonal-monorepo-template/domain';
import { IHttpClient } from '@hexagonal-monorepo-template/ports';
import { ApiCompanySettingsGateway } from './api-company-settings.gateway';

type RecordedRequest = {
  method: string;
  path: string;
  body?: unknown;
  token?: string;
};

const snapshot: CompanySettingsSnapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [],
  publicHolidays: [],
};

class RecordingHttpClient implements IHttpClient {
  readonly requests: RecordedRequest[] = [];

  async request<T>(input: RecordedRequest): Promise<T> {
    this.requests.push(input);
    return snapshot as unknown as T;
  }
}

describe('ApiCompanySettingsGateway', () => {
  it('reads the settings of a company', async () => {
    const http = new RecordingHttpClient();

    await expect(
      new ApiCompanySettingsGateway(http).get('c1', 'token'),
    ).resolves.toEqual(snapshot);
    expect(http.requests).toEqual([
      { method: 'GET', path: 'companies/c1/settings', token: 'token' },
    ]);
  });

  it('renames a company', async () => {
    const http = new RecordingHttpClient();

    await new ApiCompanySettingsGateway(http).rename('c1', 'Nexus', 'token');

    expect(http.requests).toEqual([
      {
        method: 'PATCH',
        path: 'companies/c1/name',
        body: { name: 'Nexus' },
        token: 'token',
      },
    ]);
  });

  it('replaces the non-working weekdays of a company', async () => {
    const http = new RecordingHttpClient();

    await new ApiCompanySettingsGateway(http).setNonWorkingWeekdays(
      'c1',
      [DayOfWeek.SUNDAY],
      'token',
    );

    expect(http.requests).toEqual([
      {
        method: 'PUT',
        path: 'companies/c1/calendar/non-working-weekdays',
        body: { weekdays: [DayOfWeek.SUNDAY] },
        token: 'token',
      },
    ]);
  });
});
