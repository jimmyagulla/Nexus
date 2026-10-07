import { describe, expect, it } from 'vitest';
import { CompanySettingsSnapshot } from '@hexagonal-monorepo-template/domain';
import { IHttpClient } from '@hexagonal-monorepo-template/ports';
import { ApiCompanyPublicHolidaysGateway } from './api-company-public-holidays.gateway';

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

describe('ApiCompanyPublicHolidaysGateway', () => {
  it('retains a public holiday', async () => {
    const http = new RecordingHttpClient();

    await expect(
      new ApiCompanyPublicHolidaysGateway(http).add(
        'c1',
        '2026-07-14',
        'Fête nationale',
        'token',
      ),
    ).resolves.toEqual(snapshot);
    expect(http.requests).toEqual([
      {
        method: 'POST',
        path: 'companies/c1/calendar/public-holidays',
        body: { date: '2026-07-14', label: 'Fête nationale' },
        token: 'token',
      },
    ]);
  });

  it('updates a retained public holiday', async () => {
    const http = new RecordingHttpClient();

    await new ApiCompanyPublicHolidaysGateway(http).update(
      'c1',
      'ph-1',
      '2026-11-11',
      'Armistice',
      'token',
    );

    expect(http.requests).toEqual([
      {
        method: 'PATCH',
        path: 'companies/c1/calendar/public-holidays/ph-1',
        body: { date: '2026-11-11', label: 'Armistice' },
        token: 'token',
      },
    ]);
  });

  it('removes a retained public holiday', async () => {
    const http = new RecordingHttpClient();

    await new ApiCompanyPublicHolidaysGateway(http).remove(
      'c1',
      'ph-1',
      'token',
    );

    expect(http.requests).toEqual([
      {
        method: 'DELETE',
        path: 'companies/c1/calendar/public-holidays/ph-1',
        token: 'token',
      },
    ]);
  });
});
