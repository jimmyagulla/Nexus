import { describe, expect, it } from 'vitest';
import {
  ActorContext,
  CompanySettingsSnapshot,
  DayOfWeek,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { fr } from '../ui/i18n/fr';
import {
  CompanySettingsComposition,
  createCompanySettingsComposition,
} from './company-settings.composition';

type RecordedRequest = {
  method: string;
  path: string;
  body?: unknown;
  token?: string;
};

const snapshot: CompanySettingsSnapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [DayOfWeek.SUNDAY],
  publicHolidays: [
    { id: 'ph-1', date: '2026-07-14', label: 'Fête nationale' },
  ],
};

const employerOfAcme: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const strangerToEveryCompany: ActorContext = {
  userId: 'u1',
  companyId: null,
  role: null,
};

function sessionOf(actor: ActorContext | null, token: string | null) {
  const gateway: ISessionGateway = {
    getAccessToken: async () => token,
    getActor: async () => actor,
    refresh: async () => undefined,
  };

  return gateway;
}

function compositionFor(
  actor: ActorContext | null = employerOfAcme,
  token: string | null = 'jwt',
): { requests: RecordedRequest[]; deps: CompanySettingsComposition } {
  const requests: RecordedRequest[] = [];
  const http: IHttpClient = {
    request: async <T>(input: RecordedRequest): Promise<T> => {
      requests.push(input);
      return snapshot as unknown as T;
    },
  };

  return {
    requests,
    deps: createCompanySettingsComposition(http, sessionOf(actor, token)),
  };
}

describe('createCompanySettingsComposition', () => {
  it('does not let its caller choose the api the http client targets', () => {
    expect(createCompanySettingsComposition.length).toBe(2);
  });

  it('wires a controller that reads the settings of the session company', async () => {
    const { deps, requests } = compositionFor();

    await expect(deps.controller.getSettings()).resolves.toEqual(snapshot);
    expect(requests).toEqual([
      { method: 'GET', path: 'companies/c1/settings', token: 'jwt' },
    ]);
  });

  it('wires a controller that renames the session company', async () => {
    const { deps, requests } = compositionFor();

    await deps.controller.renameCompany('Nexus');

    expect(requests).toEqual([
      {
        method: 'PATCH',
        path: 'companies/c1/name',
        body: { name: 'Nexus' },
        token: 'jwt',
      },
    ]);
  });

  it('wires a controller that replaces the non-working weekdays', async () => {
    const { deps, requests } = compositionFor();

    await deps.controller.updateNonWorkingWeekdays([DayOfWeek.SATURDAY]);

    expect(requests).toEqual([
      {
        method: 'PUT',
        path: 'companies/c1/calendar/non-working-weekdays',
        body: { weekdays: [DayOfWeek.SATURDAY] },
        token: 'jwt',
      },
    ]);
  });

  it('wires a controller that retains a public holiday', async () => {
    const { deps, requests } = compositionFor();

    await deps.controller.addPublicHoliday({
      date: '2026-11-11',
      label: 'Armistice',
    });

    expect(requests).toEqual([
      {
        method: 'POST',
        path: 'companies/c1/calendar/public-holidays',
        body: { date: '2026-11-11', label: 'Armistice' },
        token: 'jwt',
      },
    ]);
  });

  it('wires a controller that drops a retained public holiday', async () => {
    const { deps, requests } = compositionFor();

    await deps.controller.removePublicHoliday('ph-1');

    expect(requests).toEqual([
      {
        method: 'DELETE',
        path: 'companies/c1/calendar/public-holidays/ph-1',
        token: 'jwt',
      },
    ]);
  });

  it('provides the presenter the screen needs, not only the controller', () => {
    const { deps } = compositionFor();

    expect(deps.presenter.present(snapshot)).toMatchObject({
      name: 'Acme',
      selectedWeekdays: [DayOfWeek.SUNDAY],
      publicHolidays: [
        { id: 'ph-1', date: '14/07/2026', label: 'Fête nationale' },
      ],
    });
  });

  it('provides the error presenter the screen needs', () => {
    const { deps } = compositionFor();

    expect(deps.errorPresenter.present(new Error(ErrorCode.ACCESS_DENIED))).toBe(
      fr.errors.ACCESS_DENIED,
    );
  });

  it('refuses to reach the api when the session carries no company', async () => {
    const { deps, requests } = compositionFor(strangerToEveryCompany);

    await expect(deps.controller.getSettings()).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(requests).toEqual([]);
  });

  it('refuses to reach the api when nobody is signed in', async () => {
    const { deps, requests } = compositionFor(null, null);

    await expect(deps.controller.getSettings()).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(requests).toEqual([]);
  });
});
